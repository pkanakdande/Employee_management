import { X } from 'lucide-react'
import type { Employee } from '../types'

type DeleteEmployeeDialogProps = {
  employee: Employee
  error: string
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteEmployeeDialog({ employee, error, onCancel, onConfirm }: DeleteEmployeeDialogProps) {
  return <div className="overlay" role="presentation"><section className="confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-title"><span className="delete-icon"><X size={20} /></span><h2 id="delete-title">Delete employee?</h2><p>This will permanently remove <b>{employee.name}</b> from the employee directory. This action cannot be undone.</p>{error && <div className="form-error" role="alert">{error}</div>}<div className="modal-actions"><button className="button button-quiet" onClick={onCancel}>No, keep employee</button><button className="button button-danger" onClick={onConfirm}>Yes, delete</button></div></section></div>
}
