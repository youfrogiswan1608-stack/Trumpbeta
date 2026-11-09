import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Status } from '../types'

const status = atom({ plugin: 'prompt-master', key: 'status' } as const, 'idle' as Status)

// Typing a prompt that starts with this prefix rewrites it instead of sending it
// (the fallback for surfaces that draw no band above the prompt, e.g. mobile).
const PREFIX = 'pm:'

const SYSTEM = `You are Prompt Master. You rewrite a user's rough prompt for an AI coding/assistant agent into a clearer, more effective prompt.

Rules:
- Keep the user's intent, scope and voice. Never invent requirements, file names, facts or constraints they did not imply.
- Make the goal explicit in the first sentence.
- Add structure only where it helps: context, the concrete task, constraints, and what "done" looks like / desired output format.
- Resolve vague words into specific asks where the meaning is obvious; where it is not, add a short "If unclear, ask me about: ..." line instead of guessing.
- Keep it as short as it can be while complete. No preamble, no headings for a one-line ask.
- Write in the same language as the draft.
- Output ONLY the rewritten prompt text. No quotes, no commentary, no "Here is".`

async function rewrite($: EngineInterface, draft: string) {
  const r = await $.model.complete({
    model: 'sonnet',
    system: SYSTEM,
    prompt: `Rough prompt:\n<<<\n${draft}\n>>>`,
    maxTokens: 2048,
    effort: 'low',
    timeoutMs: 45000,
  })
  if (!r.isAnswered) return { error: r.reason }
  const text = r.text.trim()
  return text ? { text } : { error: 'empty-reply' }
}

async function run($: EngineInterface) {
  if ((await read($, status)) === 'busy') return
  const { text: draft } = await $.prompt.read()
  if (!draft.trim()) {
    $.ui.toast('Prompt Master: type a rough prompt first')
    return
  }
  await update($, status, () => 'busy')
  try {
    const out = await rewrite($, draft)
    if ('error' in out) {
      $.ui.toast(`Prompt Master failed: ${out.error}`)
      return
    }
    // Only replace if the person hasn't kept typing meanwhile.
    const now = await $.prompt.read()
    if (now.text !== draft) {
      $.ui.toast('Prompt Master: draft changed while rewriting, kept yours')
      return
    }
    await $.prompt.fill({ text: out.text, mode: 'replace' })
    $.ui.toast('Prompt rewritten. Review it, then send.')
  } finally {
    await update($, status, () => 'idle')
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await update($, status, () => 'idle')
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const { Box, Button, Text } = $.ui.resolve(e)
    const isBusy = (await read($, status)) === 'busy'

    return (
      <Box>
        <Button
          key="prompt-master"
          label={isBusy ? 'Rewriting...' : '✨ Prompt Master'}
          onPress={() => void run($)}
        />
        <Text dimColor> rewrites your draft in place; nothing is sent</Text>
      </Box>
    )
  })

  on('prompt.submit', async ($, e, next) => {
    if (e.command || !e.text.trimStart().toLowerCase().startsWith(PREFIX)) return next(e)
    const draft = e.text.trimStart().slice(PREFIX.length).trim()
    if (!draft) return { drop: 'Prompt Master: add your rough prompt after "pm:"' }
    const out = await rewrite($, draft)
    if ('error' in out) return { drop: `Prompt Master failed: ${out.error}` }
    // Put the rewrite back in the box once the submission has cleared it.
    void $.clock
      .sleep(150)
      .then(() => $.prompt.fill({ text: out.text, mode: 'replace' }))
    return { drop: 'Prompt rewritten into the box. Review it, then send.' }
  })
}
