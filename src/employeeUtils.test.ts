import { describe, expect, it } from 'vitest'
import { getFilteredEmployees, sortEmployees, summarizeEmployees } from './employeeUtils'
import type { Employee } from './types'

const employees: Employee[] = [
  { emp_id: 2, name: 'Maya Patel', salary: 76000, department: 'Design', joining_date: '2021-08-02', departure_date: null, active: true },
  { emp_id: 10, name: 'Noah Williams', salary: 68000, department: 'People', joining_date: '2020-11-16', departure_date: '2024-06-30', active: 0 },
  { emp_id: 3, name: 'Priya Sharma', salary: 91000, department: 'Design', joining_date: '2019-01-07', departure_date: null, active: 1 },
]

describe('getFilteredEmployees', () => {
  it('searches employee IDs and names without case sensitivity', () => {
    expect(getFilteredEmployees(employees, 'maya', '', '')).toEqual([employees[0]])
    expect(getFilteredEmployees(employees, '10', '', '')).toEqual([employees[1]])
  })

  it('combines department and active status filters', () => {
    expect(getFilteredEmployees(employees, '', 'Design', 'true')).toEqual([employees[0], employees[2]])
    expect(getFilteredEmployees(employees, '', '', 'false')).toEqual([employees[1]])
  })
})

describe('sortEmployees', () => {
  it('sorts numeric identifiers numerically and does not mutate the input', () => {
    const sorted = sortEmployees(employees, 'emp_id', 'asc')
    expect(sorted.map((employee) => employee.emp_id)).toEqual([2, 3, 10])
    expect(employees.map((employee) => employee.emp_id)).toEqual([2, 10, 3])
  })
})

describe('summarizeEmployees', () => {
  it('returns totals, active and inactive counts, and department breakdown', () => {
    expect(summarizeEmployees(employees)).toEqual({
      total: 3,
      active: 2,
      inactive: 1,
      departments: { Design: 2, People: 1 },
    })
  })

  it('handles an empty workforce', () => {
    expect(summarizeEmployees([])).toEqual({ total: 0, active: 0, inactive: 0, departments: {} })
  })
})