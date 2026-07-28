/**
 * Webflow's custom checkbox visual is a styled `div.w-checkbox-input` next to a
 * visually hidden real `<input type=checkbox>`; webflow.js toggled the
 * `w--redirected-checked` class on that div. That runtime is gone, so sync the
 * class here — on change, and once on load for restored form state.
 */
export function initCustomCheckboxes() {
  document
    .querySelectorAll<HTMLInputElement>('.w-checkbox input[type=checkbox]')
    .forEach((input) => {
      const visual = input.parentElement?.querySelector<HTMLElement>('.w-checkbox-input')
      if (!visual) return

      const sync = () => visual.classList.toggle('w--redirected-checked', input.checked)

      input.addEventListener('change', sync)
      input.addEventListener('focus', () => visual.classList.add('w--redirected-focus'))
      input.addEventListener('blur', () => visual.classList.remove('w--redirected-focus'))
      sync()
    })
}
