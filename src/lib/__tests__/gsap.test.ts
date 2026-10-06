import { expect, it, vi } from 'vitest'
import { gsap, loadSplitText } from '@/lib/gsap'

const loaded = vi.hoisted(() => vi.fn())
vi.mock('gsap/SplitText', () => {
  loaded()
  return { SplitText: { name: 'SplitText', register: vi.fn() } }
})

it('imports and registers SplitText only when explicitly requested', async () => {
  expect(loaded).not.toHaveBeenCalled()
  const register = vi.spyOn(gsap, 'registerPlugin')
  const plugin = await loadSplitText()
  expect(loaded).toHaveBeenCalledOnce()
  expect(register).toHaveBeenCalledWith(plugin)
  register.mockRestore()
})
