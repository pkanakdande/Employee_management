import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import type { Employee, EmployeeDraft } from '../types'

type FormState = Omit<EmployeeDraft, 'salary'> & { salary: string }
const emptyForm: FormState = { name: '', salary: '', department: '', joining_date: '', departure_date: '', active: true }

type EmployeeModalProps = {
  employee: Employee | null
  onClose: () => void
  onSave: (draft: EmployeeDraft) => Promise<void>
}

export function EmployeeModal({ employee, onClose, onSave }: EmployeeModalProps) {
  const [form, setForm] = useState<FormState>(employee ? { name: employee.name, salary: String(employee.salary), department: employee.department, joining_date: employee.joining_date.slice(0, 10), departure_date: employee.departure_date?.slice(0, 10) ?? '', active: Boolean(employee.active) } : emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }))

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setSaving(true)
    try { await onSave({ ...form, salary: Number(form.salary), departure_date: form.departure_date || null }) }
    catch (saveError) { setError(saveError instanceof Error ? saveError.message : 'Could not save employee') }
    finally { setSaving(false) }
  }

  return <div className="overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby="employee-modal-title">
      <div className="modal-heading"><div><span className="eyebrow">PEOPLE DIRECTORY</span><h2 id="employee-modal-title">{employee ? 'Edit employee' : 'Add employee'}</h2><p>Keep your team details up to date.</p></div><button className="icon-button" type="button" aria-label="Close form" onClick={onClose}><X size={19} /></button></div>
      <form onSubmit={submit}><div className="form-grid">
        {employee && <label className="field"><span>Employee ID</span><input value={`EMP-${String(employee.emp_id).padStart(4, '0')}`} disabled /></label>}
        <label className="field"><span>Full name</span><input autoFocus required maxLength={120} placeholder="e.g. Jordan Lee" value={form.name} onChange={(event) => setField('name', event.target.value)} /></label>
        <label className="field"><span>Annual salary</span><div className="input-prefix"><span>$</span><input type="number" min="0" step="100" required placeholder="65000" value={form.salary} onChange={(event) => setField('salary', event.target.value)} /></div></label>
        <label className="field"><span>Department</span><input required maxLength={80} placeholder="e.g. Engineering" value={form.department} onChange={(event) => setField('department', event.target.value)} /></label>
        <label className="field"><span>Joining date</span><input type="date" required value={form.joining_date} onChange={(event) => setField('joining_date', event.target.value)} /></label>
        <label className="field"><span>Departure date <small>Optional</small></span><input type="date" value={form.departure_date ?? ''} onChange={(event) => setField('departure_date', event.target.value)} /></label>
        <label className="toggle-row"><span><b>Active employee</b><small>Include this person in the active headcount</small></span><input type="checkbox" checked={Boolean(form.active)} onChange={(event) => setField('active', event.target.checked)} /></label>
      </div>{error && <div className="form-error" role="alert">{error}</div>}<div className="modal-actions"><button className="button button-quiet" type="button" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : employee ? 'Save changes' : 'Add employee'}</button></div></form>
    </section>
  </div>
}
