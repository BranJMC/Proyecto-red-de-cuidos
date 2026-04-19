import { FileUploader } from '../../components/ui/FileUploader'

export function DocumentsPage() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <FileUploader label="Certificados y cursos" helper="Sube PDF o imagenes para revision admin." />
      <FileUploader label="Antecedentes o soporte adicional" helper="Expediente listo para aprobacion, suspension o revalidacion." />
    </div>
  )
}
