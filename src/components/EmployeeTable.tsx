import type { ReactNode } from 'react'
import { Users } from 'lucide-react'
import type { Employee } from '../types'
import type { SortKey } from '../employeeUtils'
import { dateLabel, formatMoney, isActive } from '../formatters'

type EmployeeTableProps = {
  employees: Employee[]
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
  onSort: (key: SortKey) => void
  sortIcon: (key: SortKey) => ReactNode
  compact?: boolean
}

export function EmployeeTable({ employees, onEdit, onDelete, onSort, sortIcon, compact = false }: EmployeeTableProps) {
  const heading = (label: string, key: SortKey) => <button className="sort-heading" onClick={() => onSort(key)}>{label}{sortIcon(key)}</button>

  return <div className="table-scroll"><table><thead><tr><th>{heading('EMPLOYEE', 'name')}</th>{!compact && <th>{heading('EMPLOYEE ID', 'emp_id')}</th>}<th>{heading('DEPARTMENT', 'department')}</th>{!compact && <th>{heading('SALARY', 'salary')}</th>}<th>{heading('JOINED', 'joining_date')}</th>{!compact && <th>{heading('DEPARTURE', 'departure_date')}</th>}<th>{heading('STATUS', 'active')}</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{employees.map((employee) => <tr key={employee.emp_id}><td><div className="employee-cell"><span className={`avatar ${['avatar-purple', 'avatar-peach', 'avatar-blue', 'avatar-green'][employee.emp_id % 4]}`}>{employee.name.split(/\s+/).map((word) => word[0]).slice(0, 2).join('').toUpperCase()}</span><span><b>{employee.name}</b><small>Team member</small></span></div></td>{!compact && <td><span className="id-label">EMP-{String(employee.emp_id).padStart(4, '0')}</span></td>}<td>{employee.department}</td>{!compact && <td className="salary-cell">{formatMoney(Number(employee.salary))}</td>}<td>{dateLabel(employee.joining_date)}</td>{!compact && <td>{dateLabel(employee.departure_date)}</td>}<td><span className={`badge ${isActive(employee) ? 'badge-active' : 'badge-inactive'}`}><span />{isActive(employee) ? 'Active' : 'Inactive'}</span></td><td><div className="row-actions"><button aria-label={`Edit ${employee.name}`} onClick={() => onEdit(employee)}>Edit</button><button aria-label={`Delete ${employee.name}`} onClick={() => onDelete(employee)}>Delete</button></div></td></tr>)}</tbody></table>{employees.length === 0 && <div className="empty-state"><span className="empty-icon"><Users size={22} /></span><b>No employees found</b><p>Try adjusting your search or filters, or add a new employee.</p></div>}</div>
}
