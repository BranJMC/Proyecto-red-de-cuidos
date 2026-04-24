import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { useToast } from '../../hooks/useToast'

export function BookingModal({ caregiverName }: { caregiverName: string }) {
  const [open, setOpen] = useState(false)
  const toast = useToast()

  return (
    <>
      <Button onClick={() => setOpen(true)}>Reservar ahora</Button>
      <Modal open={open} title={`Reservar a ${caregiverName}`} onClose={() => setOpen(false)}>
        <div className="grid gap-4 md:grid-cols-2">
          <input className="field" placeholder="Fecha" />
          <input className="field" placeholder="Hora" />
          <input className="field" placeholder="Horas requeridas" />
          <input className="field" placeholder="Direccion del servicio" />
        </div>
        <textarea className="field mt-4 min-h-28" placeholder="Notas sobre la rutina, alergias o cuidados especiales" />
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              toast.success('Solicitud enviada', 'La reserva se envio al cuidador para aceptacion.')
              setOpen(false)
            }}
          >
            Confirmar solicitud
          </Button>
        </div>
      </Modal>
    </>
  )
}
