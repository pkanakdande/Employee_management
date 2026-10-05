import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { employeeApi } from './api'
import { getFilteredEmployees, sortEmployees, summarizeEmployees, type SortKey } from './employeeUtils'
import type { Employee, EmployeeDraft } from './types'
import { DashboardView } from './components/DashboardView'
import { DeleteEmployeeDialog } from './components/DeleteEmployeeDialog'
import { EmployeeDirectory } from './components/EmployeeDirectory'
import { EmployeeModal } from './components/EmployeeModal'
import { Sidebar } from './components/Sidebar'
import { Topbar } from './components/Topbar'
import type { View } from './components/viewTypes'
import './App.scss'

const PAGE_SIZE = 7

function App() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [view, setView] = useState<View>('dashboard')
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('emp_id')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [modalEmployee, setModalEmployee] = useState<Employee | null | undefined>(undefined)
  const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null)
  const [deleteError, setDeleteError] = useState('')

  async function loadEmployees() {
    setLoading(true)
    try { setEmployees(await employeeApi.list()); setPageError('') }
    catch (error) { setPageError(error instanceof Error ? error.message : 'Unable to connect to the employee service') }
    finally { setLoading(false) }
  }
  useEffect(() => {
    const initialize = async () => { await loadEmployees() }
    void initialize()
  }, [])
  const departments = useMemo(() => [...new Set(employees.map((employee) => employee.department))].sort(), [employees])
  const stats = useMemo(() => summarizeEmployees(employees), [employees])
  const filtered = useMemo(() => sortEmployees(getFilteredEmployees(employees, query, department, status), sortKey, sortDirection), [employees, query, department, status, sortKey, sortDirection])
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDirection((direction) => direction === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDirection('asc') }
  }
  const saveEmployee = async (draft: EmployeeDraft) => {
    if (modalEmployee) await employeeApi.update(modalEmployee.emp_id, draft)
    else await employeeApi.create(draft)
    setModalEmployee(undefined); await loadEmployees()
  }
  const removeEmployee = async () => {
    if (!deleteEmployee) return
    try { await employeeApi.remove(deleteEmployee.emp_id); setDeleteEmployee(null); setDeleteError(''); await loadEmployees() }
    catch (error) { setDeleteError(error instanceof Error ? error.message : 'Unable to delete employee') }
  }
  const sortIcon = (key: SortKey) => sortKey !== key ? <ArrowUpDown size={13} /> : sortDirection === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />

  return <div className="app-shell">
    <Sidebar view={view} employeeCount={employees.length} onViewChange={setView} />
    <main className="main-area"><Topbar view={view} />
      {pageError && <div className="connection-alert" role="alert"><span><b>Could not load employee data.</b> {pageError}. Start the API server and verify your MySQL settings.</span><button className="button button-quiet" onClick={() => void loadEmployees()}>Retry</button></div>}
      <div className="page-content">{view === 'dashboard' ? <DashboardView employees={employees} stats={stats} onAddEmployee={() => setModalEmployee(null)} onViewEmployees={() => setView('employees')} onEdit={setModalEmployee} onDelete={setDeleteEmployee} /> : <EmployeeDirectory
        employees={pageRows}
        total={filtered.length}
        loading={loading}
        departments={departments}
        query={query}
        department={department}
        status={status}
        page={page}
        pageCount={pageCount}
        onAddEmployee={() => setModalEmployee(null)}
        onQueryChange={(value) => { setQuery(value); setPage(1) }}
        onDepartmentChange={(value) => { setDepartment(value); setPage(1) }}
        onStatusChange={(value) => { setStatus(value); setPage(1) }}
        onPageChange={setPage}
        onEdit={setModalEmployee}
        onDelete={setDeleteEmployee}
        onSort={toggleSort}
        sortIcon={sortIcon}
      />}</div>
    </main>
    {modalEmployee !== undefined && <EmployeeModal employee={modalEmployee} onClose={() => setModalEmployee(undefined)} onSave={saveEmployee} />}
    {deleteEmployee && <DeleteEmployeeDialog employee={deleteEmployee} error={deleteError} onCancel={() => { setDeleteEmployee(null); setDeleteError('') }} onConfirm={() => void removeEmployee()} />}
  </div>
}

export default App
