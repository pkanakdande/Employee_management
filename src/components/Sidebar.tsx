import { LayoutDashboard, Users } from 'lucide-react'
import type { View } from './viewTypes'

type SidebarProps = {
  view: View
  employeeCount: number
  onViewChange: (view: View) => void
}

export function Sidebar({ view, employeeCount, onViewChange }: SidebarProps) {
  return <aside className="sidebar"><div className="brand"><span className="brand-mark"><Users size={19} /></span><span>people<span className="brand-light">desk</span></span></div><div className="side-caption">WORKSPACE</div><nav aria-label="Main navigation">
    <button className={`nav-link ${view === 'dashboard' ? 'selected' : ''}`} onClick={() => onViewChange('dashboard')}><LayoutDashboard size={18} /> Dashboard</button>
    <button className={`nav-link ${view === 'employees' ? 'selected' : ''}`} onClick={() => onViewChange('employees')}><Users size={18} /> Employees <span className="nav-count">{employeeCount}</span></button>
  </nav><div className="sidebar-bottom"><div className="side-caption">TEAM STATUS</div><div className="team-status"><span className="status-dot" /> All systems operational</div><div className="sidebar-footer"><span className="avatar avatar-purple">P</span><div><b>Pranav</b><small>Administrator</small></div><button aria-label="Account options" className="more-button">···</button></div></div></aside>
}
