import Highcharts from 'highcharts'
import { HighchartsReact } from 'highcharts-react-official'
import { Activity, ArrowDown, BriefcaseBusiness, ChartNoAxesCombined, ChevronRight, CircleDollarSign, Plus, Users } from 'lucide-react'
import { sortEmployees, } from '../employeeUtils'
import { formatMoney } from '../formatters'
import type {DashboardViewProps} from '../types'
import { EmployeeTable } from './EmployeeTable'


export function DashboardView({ employees, stats, onAddEmployee, onViewEmployees, onEdit, onDelete }: DashboardViewProps) {
  const departmentChart: Highcharts.Options = {
    chart: { type: 'column', height: 260, backgroundColor: 'transparent', spacing: [12, 4, 0, 0] }, title: { text: undefined }, credits: { enabled: false }, legend: { enabled: false },
    xAxis: { categories: Object.keys(stats.departments), lineColor: '#e9edf3', tickLength: 0, labels: { style: { color: '#748096', fontSize: '11px' } } },
    yAxis: { title: { text: undefined }, allowDecimals: false, gridLineColor: '#edf0f5', labels: { style: { color: '#9aa3b2', fontSize: '11px' } } },
    tooltip: { pointFormat: '<b>{point.y}</b> employees' }, plotOptions: { column: { borderRadius: 5, pointWidth: 34, color: '#6258e8', borderWidth: 0 } },
    series: [{ type: 'column', name: 'Employees', data: Object.values(stats.departments) }],
  }
  const activeChart: Highcharts.Options = {
    chart: { type: 'pie', height: 260, backgroundColor: 'transparent', spacing: [0, 0, 0, 0] }, title: { text: undefined }, credits: { enabled: false },
    tooltip: { pointFormat: '<b>{point.y}</b> employees ({point.percentage:.0f}%)' }, plotOptions: { pie: { innerSize: '70%', borderWidth: 4, borderColor: '#fff', dataLabels: { enabled: false }, showInLegend: true } },
    legend: { align: 'right', verticalAlign: 'middle', layout: 'vertical', itemStyle: { color: '#657086', fontWeight: '500', fontSize: '12px' }, symbolRadius: 6, symbolHeight: 9, symbolWidth: 9, itemMarginBottom: 10 },
    series: [{ type: 'pie', name: 'Employees', data: [{ name: 'Active', y: stats.active, color: '#32b889' }, { name: 'Inactive', y: stats.inactive, color: '#e5e9f0' }] }],
  }

  return <>
    <div className="page-title-row"><div><span className="eyebrow">OVERVIEW</span><h1>Dashboard</h1><p className="page-subtitle">A snapshot of your people and team health.</p></div><button className="button button-primary" onClick={onAddEmployee}><Plus size={17} /> Add employee</button></div>
    <section className="stats-grid" aria-label="Employee summary">
      <article className="stat-card"><div className="stat-top"><span>Total employees</span><span className="stat-icon violet"><Users size={18} /></span></div><strong>{stats.total}</strong><small>Across {Object.keys(stats.departments).length} departments</small><div className="stat-spark spark-violet" aria-hidden="true">↗</div></article>
      <article className="stat-card"><div className="stat-top"><span>Active employees</span><span className="stat-icon green"><Activity size={18} /></span></div><strong>{stats.active}</strong><small><span className="green-text">{stats.total ? Math.round(stats.active / stats.total * 100) : 0}%</span> of your workforce</small><div className="stat-spark spark-green" aria-hidden="true">↗</div></article>
      <article className="stat-card"><div className="stat-top"><span>Departments</span><span className="stat-icon amber"><BriefcaseBusiness size={18} /></span></div><strong>{Object.keys(stats.departments).length}</strong><small>Teams in your organization</small><div className="stat-spark spark-amber" aria-hidden="true">⌘</div></article>
      <article className="stat-card"><div className="stat-top"><span>Average salary</span><span className="stat-icon blue"><CircleDollarSign size={18} /></span></div><strong>{formatMoney(stats.total ? employees.reduce((sum, employee) => sum + Number(employee.salary), 0) / stats.total : 0)}</strong><small>Annual compensation</small><div className="stat-spark spark-blue" aria-hidden="true">$</div></article>
    </section>
    <section className="charts-grid"><article className="panel chart-panel"><div className="panel-heading"><div><h2>Employees by department</h2><p>Distribution across your teams</p></div><span className="panel-icon"><ChartNoAxesCombined size={17} /></span></div>{employees.length ? <HighchartsReact highcharts={Highcharts} options={departmentChart} /> : <div className="chart-empty">Add employees to see your department breakdown.</div>}</article><article className="panel chart-panel"><div className="panel-heading"><div><h2>Workforce status</h2><p>Active versus inactive employees</p></div><span className="panel-icon"><Activity size={17} /></span></div>{employees.length ? <HighchartsReact highcharts={Highcharts} options={activeChart} /> : <div className="chart-empty">Your workforce status chart will appear here.</div>}</article></section>
    <section className="panel recent-panel"><div className="panel-heading"><div><h2>Recently added</h2><p>Your latest team members</p></div><button className="text-button" onClick={onViewEmployees}>View all employees <ChevronRight size={15} /></button></div><EmployeeTable employees={sortEmployees(employees, 'emp_id', 'desc').slice(0, 4)} onEdit={onEdit} onDelete={onDelete} onSort={() => undefined} sortIcon={() => <ArrowDown size={13} />} compact /></section>
  </>
}
