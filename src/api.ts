import type { Employee, EmployeeDraft } from './types'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null
    throw new Error(body?.message ?? `Request failed (${response.status})`)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const employeeApi = {
  list: () => request<Employee[]>('/employees'),
  create: (employee: EmployeeDraft) => request<Employee>('/employees', { method: 'POST', body: JSON.stringify(employee) }),
  update: (id: number, employee: EmployeeDraft) => request<Employee>(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(employee) }),
  remove: (id: number) => request<void>(`/employees/${id}`, { method: 'DELETE' }),
}
