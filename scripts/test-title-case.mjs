import { titleCaseName } from './lib/scrape.js'

const cases = [
  ['the pizzas', 'The Pizzas'],
  ['handhelds', 'Handhelds'],
  ['cocktails', 'Cocktails'],
  ['Red wine', 'Red Wine'],
  ['White Wine', 'White Wine'],
  ['Middle table', 'Middle Table'],
  ['NY Pepperoni', 'NY Pepperoni'],
  ['Margherita DOP', 'Margherita DOP'],
  ['Rotating Marg (2oz)', 'Rotating Marg (2oz)'],
  ['Chinchilla (2 oz)', 'Chinchilla (2 oz)'],
  ['Paella Arancini (1pc)', 'Paella Arancini (1pc)'],
  ['General Tao Bao (2 pcs)', 'General Tao Bao (2 pcs)'],
  ['Cookies of the Day', 'Cookies of the Day'],
  ['Bread & Butter', 'Bread & Butter'],
  ["Chef's Toast (1pc)", "Chef's Toast (1pc)"],
  ['Doline Primitivo 2020', 'Doline Primitivo 2020'],
  ['Andeluna 1300 Malbec 2024', 'Andeluna 1300 Malbec 2024'],
  ['lunch', 'Lunch'],
  ['White wine', 'White Wine'],
]

let failed = 0
for (const [input, expected] of cases) {
  const got = titleCaseName(input)
  if (got !== expected) {
    failed += 1
    console.error(`FAIL ${JSON.stringify(input)} → ${JSON.stringify(got)} (want ${JSON.stringify(expected)})`)
  }
}
if (failed) {
  process.exitCode = 1
} else {
  console.log(`ok ${cases.length}`)
}
