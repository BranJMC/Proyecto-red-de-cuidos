import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChatLayout } from '../../components/ui/ChatLayout'
import { useToast } from '../../hooks/useToast'
import { useSocket } from '../../hooks/useSocket'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { MessageThread, ServiceUpdate, ShiftLog } from '../../types'

export function CaregiverMessagesPage() {
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
        setShiftLog(nextShiftLog ?? {
          bookingId,
          caregiverName: user.name,
          checkIn: '',
          status: 'pending-start',
        })
      }
    })
  }, [user.id, user.name])

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
      onCheckIn={async (bookingId) => {
        if (!user.id) {
          return
        }

        try {
          setShiftLog(await mockApi.markShiftCheckIn(bookingId, user.id))
          toast.success('Entrada registrada', 'La hora de entrada ya quedo guardada.')
        } catch {
          toast.error('No se pudo registrar', 'La entrada no pudo guardarse en la base de datos.')
        }
      }}
      onCheckOut={async (bookingId) => {
        if (!user.id) {
          return
        }

        try {
          setShiftLog(await mockApi.markShiftCheckOut(bookingId, user.id))
          toast.success('Salida registrada', 'La hora de salida ya quedo guardada.')
        } catch {
          toast.error('No se pudo registrar', 'La salida no pudo guardarse en la base de datos.')
        }
      }}
    />
  )
}
