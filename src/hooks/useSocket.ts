import { useEffect } from 'react'
import { socket } from '../services/socket'
import { useToast } from './useToast'

export function useSocket(channel = 'notifications') {
  const toast = useToast()

  useEffect(() => {
    socket.connect()

    const onMessage = () => {
      toast.success('Evento en tiempo real', `Nuevo evento recibido en ${channel}.`)
    }

    socket.on(channel, onMessage)
    return () => {
      socket.off(channel, onMessage)
      socket.disconnect()
    }
  }, [channel, toast])
}
