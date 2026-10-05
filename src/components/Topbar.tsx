import { CalendarDays } from 'lucide-react'
import type { View } from './viewTypes'

type TopbarProps = {
  view: View
}

export function Topbar({ view }: TopbarProps) {
  return <header className="topbar"><div className="breadcrumbs">Workspace <span>/</span> <b>{view === 'dashboard' ? 'Dashboard' : 'Employees'}</b></div><div className="topbar-right"><span className="today"><CalendarDays size={15} /> {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span><span className="avatar avatar-small avatar-purple">P</span></div></header>
}
