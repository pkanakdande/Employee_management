import type { Employee } from './types'

export type SortKey = keyof Employee

export function getFilteredEmployees(
  employees: Employee[],
  search: string,
  department: string,
  status: string,
): Employee[] {
  const query = search.trim().toLowerCase()
  return employees.filter((employee) => {
    const matchesQuery = !query || String(employee.emp_id).includes(query) || employee.name.toLowerCase().includes(query)
    const matchesDepartment = !department || employee.department === department
    const matchesStatus = !status || String(Boolean(employee.active)) === status
    return matchesQuery && matchesDepartment && matchesStatus
  })
}

export function sortEmployees(employees: Employee[], key: SortKey, direction: 'asc' | 'desc'): Employee[] {
  return [...employees].sort((a, b) => {
    const left = a[key]
    const right = b[key]
    const comparison = typeof left === 'number' || typeof right === 'number'
      ? Number(left) - Number(right)
      : String(left ?? '').localeCompare(String(right ?? ''), undefined, { numeric: true, sensitivity: 'base' })
    return direction === 'asc' ? comparison : -comparison
  })
}

export function summarizeEmployees(employees: Employee[]) {
  const departmentCounts = employees.reduce<Record<string, number>>((counts, employee) => {
    counts[employee.department] = (counts[employee.department] ?? 0) + 1
    return counts
  }, {})
  const activeCount = employees.filter((employee) => Boolean(employee.active)).length
  return {
    total: employees.length,
    active: activeCount,
    inactive: employees.length - activeCount,
    departments: departmentCounts,
  }
}
