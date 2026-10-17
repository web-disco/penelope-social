import { useEffect, useState } from 'react'
import { Select, Text } from '@sanity/ui'
import { set, unset, useClient, useFormValue, type StringInputProps } from 'sanity'

type SourceItem = { _key: string; title?: string; price?: string }
type SourceCategory = { _key: string; title?: string; items?: SourceItem[] }

/**
 * Dropdown of every item on the chosen source menu, grouped by category.
 * Stores the item's `_key`, which survives renames and reordering on the
 * source menu. Reads the draft when there is one, so an item just added to
 * Dinner can be picked before Dinner is published.
 */
export function MenuItemKeyInput(props: StringInputProps) {
  const { value, onChange, path, elementProps } = props
  const menuRef = useFormValue([...path.slice(0, -1), 'menu', '_ref']) as string | undefined
  const client = useClient({ apiVersion: '2025-02-19' })
  const [categories, setCategories] = useState<SourceCategory[] | null>(null)

  useEffect(() => {
    if (!menuRef) return
    let cancelled = false
    setCategories(null)
    client
      .withConfig({ perspective: 'drafts' })
      .fetch<SourceCategory[]>(
        // Only plain items: a linked item on the source menu has no name of its own.
        `*[_id == $id][0].categories[]{_key, title, "items": items[_type == "menuItem"]{_key, title, price}}`,
        { id: menuRef },
      )
      .then((result) => !cancelled && setCategories(result ?? []))
    return () => {
      cancelled = true
    }
  }, [client, menuRef])

  if (!menuRef) return null
  if (!categories) return <Text size={1} muted>Loading items…</Text>

  const known = categories.some((category) => category.items?.some((item) => item._key === value))

  return (
    <Select
      {...elementProps}
      value={value ?? ''}
      onChange={(event) => {
        const next = event.currentTarget.value
        onChange(next ? set(next) : unset())
      }}
    >
      <option value="">Pick an item…</option>
      {value && !known && <option value={value}>Missing item ({value})</option>}
      {categories.map((category) => (
        <optgroup key={category._key} label={category.title ?? 'Untitled category'}>
          {(category.items ?? []).map((item) => (
            <option key={item._key} value={item._key}>
              {[item.title ?? 'Untitled', item.price].filter(Boolean).join(' — ')}
            </option>
          ))}
        </optgroup>
      ))}
    </Select>
  )
}
