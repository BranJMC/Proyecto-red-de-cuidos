import { useEffect, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../hooks/useToast'
import { mockApi } from '../../services/api'
import type { ContentItem } from '../../types'
import { statusTone } from '../../utils/helpers'

export function ContentManagementPage() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [activeItemId, setActiveItemId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [section, setSection] = useState('')
  const [status, setStatus] = useState<'draft' | 'scheduled' | 'published'>('draft')
  const [body, setBody] = useState('')
  const toast = useToast()

  useEffect(() => {
    mockApi.getContentItems().then(setContentItems)
  }, [])

  function openEditor(item: ContentItem) {
    setActiveItemId(item.id)
    setTitle(item.title)
    setSection(item.section)
    setStatus(item.status)
    setBody(item.body ?? '')
  }

  async function saveItem() {
    if (!activeItemId) {
      return
    }

    try {
      await mockApi.updateContentItem(activeItemId, { title, section, status, body })
      setContentItems(await mockApi.getContentItems())
      toast.success('Contenido guardado', 'Los cambios de contenido ya quedaron guardados en la base.')
    } catch {
      toast.error('No se pudo guardar', 'El contenido no pudo actualizarse.')
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="space-y-4">
        {contentItems.map((item) => (
          <article key={item.id} className="rounded-[28px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl text-slate-950 dark:text-white">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.section}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(item.status)}`}>{item.status}</span>
            </div>
            <Button className="mt-5" variant="secondary" onClick={() => openEditor(item)}>Editar</Button>
          </article>
        ))}
      </section>
      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
        <h2 className="font-display text-3xl text-slate-950 dark:text-white">Editor de contenido</h2>
        {activeItemId ? (
          <div className="mt-6 grid gap-4">
            <input className="field" value={title} onChange={(event) => setTitle(event.target.value)} />
            <input className="field" value={section} onChange={(event) => setSection(event.target.value)} />
            <select className="field" value={status} onChange={(event) => setStatus(event.target.value as 'draft' | 'scheduled' | 'published')}>
              <option value="draft">draft</option>
              <option value="scheduled">scheduled</option>
              <option value="published">published</option>
            </select>
            <textarea className="field min-h-56" value={body} onChange={(event) => setBody(event.target.value)} />
            <Button onClick={saveItem}>Guardar cambios</Button>
          </div>
        ) : (
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">Selecciona un contenido para editarlo.</p>
        )}
      </section>
    </div>
  )
}
