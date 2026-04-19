import { ImagePlus } from 'lucide-react'
import type { MessageThread } from '../../types'
import { initials } from '../../utils/helpers'
import { Button } from './Button'

export function ChatLayout({ threads }: { threads: MessageThread[] }) {
  const activeThread = threads[0]

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="rounded-[32px] border border-slate-200 bg-white/85 p-4 dark:border-white/10 dark:bg-slate-900/70">
        <div className="mb-4 px-2">
          <h3 className="font-display text-xl text-slate-950 dark:text-white">Conversaciones</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Chat y notificaciones en vivo listos para Socket.io.</p>
        </div>
        <div className="space-y-2">
          {threads.map((thread) => (
            <button
              key={thread.id}
              className={`flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition ${
                thread.id === activeThread.id
                  ? 'bg-slate-950 text-white dark:bg-cyan-400 dark:text-slate-950'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex size-11 items-center justify-center rounded-full bg-white/15 font-semibold">
                {initials(thread.participant)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate font-medium">{thread.participant}</p>
                  <span className="text-xs opacity-70">{thread.lastMessageAt}</span>
                </div>
                <p className="truncate text-sm opacity-70">{thread.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>
      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-white/10">
          <div>
            <h3 className="font-display text-2xl text-slate-950 dark:text-white">{activeThread.participant}</h3>
            <p className="text-sm text-emerald-500">{activeThread.status === 'online' ? 'En linea' : 'Fuera de linea'} • escribiendo...</p>
          </div>
          <Button variant="secondary">Ver perfil</Button>
        </div>
        <div className="space-y-4 py-6">
          {activeThread.messages.map((message) => (
            <div key={message.id} className={message.author === 'me' ? 'flex justify-end' : 'flex justify-start'}>
              <div
                className={`max-w-md rounded-[24px] px-4 py-3 text-sm ${
                  message.author === 'me'
                    ? 'bg-slate-950 text-white dark:bg-cyan-400 dark:text-slate-950'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                <p>{message.content}</p>
                <p className="mt-2 text-xs opacity-70">{message.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 rounded-[28px] border border-slate-200 p-4 dark:border-white/10 sm:flex-row">
          <input
            className="min-h-12 flex-1 rounded-2xl bg-slate-50 px-4 text-sm text-slate-700 outline-none dark:bg-slate-800 dark:text-slate-200"
            placeholder="Escribe un mensaje..."
          />
          <Button variant="secondary">
            <ImagePlus className="mr-2 size-4" />
            Imagen
          </Button>
          <Button>Enviar</Button>
        </div>
      </section>
    </div>
  )
}
