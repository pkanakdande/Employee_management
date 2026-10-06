import type { summarizeEmployees } from "./employeeUtils"

export type Employee = {
  emp_id: number
  name: string
  salary: number
  department: string
  joining_date: string
  departure_date: string | null
  active: boolean | number
}
export type DashboardViewProps = {
  employees: Employee[]
  stats: ReturnType<typeof summarizeEmployees>
  onAddEmployee: () => void
  onViewEmployees: () => void
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
}
export type EmployeeDraft = Omit<Employee, 'emp_id'>

export type View = 'dashboard' | 'employees'
