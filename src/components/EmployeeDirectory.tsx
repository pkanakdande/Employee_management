import { BriefcaseBusiness, ChevronLeft, ChevronRight, ListFilter, Plus, Search } from 'lucide-react'
import type { Employee } from '../types'
import type { SortKey } from '../employeeUtils'
import { EmployeeTable } from './EmployeeTable'

type EmployeeDirectoryProps = {
  employees: Employee[]
  total: number
  loading: boolean
  departments: string[]
  query: string
  department: string
  status: string
  page: number
  pageCount: number
  onAddEmployee: () => void
  onQueryChange: (query: string) => void
  onDepartmentChange: (department: string) => void
  onStatusChange: (status: string) => void
  onPageChange: (page: number) => void
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
  onSort: (key: SortKey) => void
  sortIcon: (key: SortKey) => React.ReactNode
}

export function EmployeeDirectory({ employees, total, loading, departments, query, department, status, page, pageCount, onAddEmployee, onQueryChange, onDepartmentChange, onStatusChange, onPageChange, onEdit, onDelete, onSort, sortIcon }: EmployeeDirectoryProps) {
  return <>
    <div className="page-title-row"><div><span className="eyebrow">PEOPLE DIRECTORY</span><h1>Employees</h1><p className="page-subtitle">Manage your team details and employment status.</p></div><button className="button button-primary" onClick={onAddEmployee}><Plus size={17} /> Add employee</button></div>
    <div className="toolbar panel"><label className="search-box"><Search size={17} /><input aria-label="Search employees" placeholder="Search by name or employee ID..." value={query} onChange={(event) => onQueryChange(event.target.value)} /></label><div className="toolbar-filters"><label className="select-wrap"><BriefcaseBusiness size={15} /><select aria-label="Filter by department" value={department} onChange={(event) => onDepartmentChange(event.target.value)}><option value="">All departments</option>{departments.map((name) => <option key={name}>{name}</option>)}</select></label><label className="select-wrap"><ListFilter size={15} /><select aria-label="Filter by status" value={status} onChange={(event) => onStatusChange(event.target.value)}><option value="">All statuses</option><option value="true">Active</option><option value="false">Inactive</option></select></label></div></div>
    <section className="panel directory-panel"><div className="directory-meta"><span><b>{total}</b> {total === 1 ? 'employee' : 'employees'}</span><span className="live-label"><span className="status-dot" /> Live directory</span></div>{loading ? <div className="loading-state">Loading your team…</div> : <EmployeeTable employees={employees} onEdit={onEdit} onDelete={onDelete} onSort={onSort} sortIcon={sortIcon} />}
      {!loading && <div className="pagination"><span>Showing <b>{total ? (page - 1) * 7 + 1 : 0}–{Math.min(page * 7, total)}</b> of <b>{total}</b></span><div className="pagination-controls"><button aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)}><ChevronLeft size={16} /></button><span>Page <b>{page}</b> of {pageCount}</span><button aria-label="Next page" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}><ChevronRight size={16} /></button></div></div>}
    </section>
  </>
}
