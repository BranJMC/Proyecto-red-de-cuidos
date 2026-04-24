import { Camera, Clock3, ImagePlus } from 'lucide-react'
import type { MessageThread, ServiceUpdate, ShiftLog } from '../../types'
import { initials } from '../../utils/helpers'
import { Button } from './Button'

export function ChatLayout({
  threads,
  shiftLog,
  hourlyUpdates,
}: {
  threads: MessageThread[]
  shiftLog?: ShiftLog
  hourlyUpdates?: ServiceUpdate[]
}) {
  const activeThread = threads[0]

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="self-start rounded-[32px] border border-slate-200 bg-white/85 p-4 dark:border-white/10 dark:bg-slate-900/70">
        <div className="mb-4 px-2">
          <h3 className="font-display text-xl text-slate-950 dark:text-white">Conversaciones</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Chat, evidencias y seguimiento operativo del servicio.</p>
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
        <div className="sticky top-20 z-10 mt-5 rounded-[28px] border border-slate-200 bg-white/95 p-4 shadow-lg shadow-slate-200/30 backdrop-blur dark:border-white/10 dark:bg-slate-900/95 dark:shadow-none">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Escribe sin tener que bajar al final de la conversacion.
            </p>
            <Button variant="secondary">
              <Camera className="mr-2 size-4" />
              Evidencia
            </Button>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              className="min-h-12 flex-1 rounded-2xl bg-slate-50 px-4 text-sm text-slate-700 outline-none dark:bg-slate-800 dark:text-slate-200"
              placeholder="Escribe un mensaje o status del servicio..."
            />
            <Button variant="secondary">
              <ImagePlus className="mr-2 size-4" />
              Imagen
            </Button>
            <Button>Enviar</Button>
          </div>
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
        {shiftLog ? (
          <div className="mb-5 rounded-[28px] border border-slate-200 bg-slate-50/90 p-5 dark:border-white/10 dark:bg-slate-800/45">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-300">Control horario</p>
                <h4 className="mt-2 font-display text-2xl text-slate-950 dark:text-white">
                  Entrada {shiftLog.checkIn} {shiftLog.checkOut ? `• Salida ${shiftLog.checkOut}` : '• Servicio en curso'}
                </h4>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary">
                  <Clock3 className="mr-2 size-4" />
                  Marcar entrada
                </Button>
                <Button>Marcar salida</Button>
              </div>
            </div>
          </div>
        ) : null}
        {hourlyUpdates?.length ? (
          <div className="mb-5 rounded-[28px] border border-slate-200 p-5 dark:border-white/10">
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-300">Status por hora obligatorio</p>
              <h4 className="mt-2 font-display text-2xl text-slate-950 dark:text-white">Seguimiento con evidencia</h4>
            </div>
            <div className="space-y-3">
              {hourlyUpdates.map((update) => (
                <div key={update.id} className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium text-slate-950 dark:text-white">{update.hourLabel}</p>
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white dark:bg-cyan-400 dark:text-slate-950">
                      {update.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{update.summary}</p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Evidencia: {update.evidenceLabel}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  )
}
