import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChatLayout } from '../../components/ui/ChatLayout'
import { useToast } from '../../hooks/useToast'
import { useSocket } from '../../hooks/useSocket'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { MessageThread, ServiceUpdate, ShiftLog } from '../../types'

export function ClientMessagesPage() {
  useSocket('chat')
  const [searchParams] = useSearchParams()
  const [threads, setThreads] = useState<MessageThread[]>([])
  const [hourlyUpdates, setHourlyUpdates] = useState<ServiceUpdate[]>([])
  const [shiftLog, setShiftLog] = useState<ShiftLog | undefined>()
  const user = useAppStore((state) => state.user)
  const toast = useToast()

  useEffect(() => {
    if (!user.id) {
      return
    }

    mockApi.getThreadsByUser(user.id).then(async (items) => {
      setThreads(items)
      const bookingId = items[0]?.bookingId
      if (bookingId) {
        const [updates, nextShiftLog] = await Promise.all([
          mockApi.getHourlyServiceUpdatesForBooking(bookingId),
          mockApi.getShiftLog(bookingId),
        ])
        setHourlyUpdates(updates)
        setShiftLog(nextShiftLog ?? undefined)
      }
    })
  }, [user.id])

  return (
    <ChatLayout
      threads={threads}
      shiftLog={shiftLog}
      hourlyUpdates={hourlyUpdates}
      initialThreadId={searchParams.get('thread')}
      onSendMessage={async ({ conversationId, content }) => {
        if (!user.id) {
          return
        }

        try {
          await mockApi.sendMessage({ conversationId, senderId: user.id, content })
          setThreads(await mockApi.getThreadsByUser(user.id))
        } catch {
          toast.error('No se pudo enviar', 'El mensaje no pudo guardarse en la base de datos.')
        }
      }}
    />
  )
}
