import 'dotenv/config'
import cors from 'cors'
import express, { type Request, type Response } from 'express'
import mysql from 'mysql2/promise'

const app = express()
const port = Number(process.env.API_PORT ?? 3001)
const pool = mysql.createPool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'employee_management',
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true,
  dateStrings: true,
})

console.log("database connected")
type EmployeeInput = {
  name: string
  salary: number
  department: string
  joining_date: string
  departure_date: string | null
  active: boolean
}

app.use(cors())
app.use(express.json())

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok' })
  } catch {
    res.status(503).json({ status: 'error', message: 'Database is unavailable' })
  }
})

app.get('/api/employees', async (req: Request, res: Response) => {
  try {
    const search = String(req.query.search ?? '').trim()
    const department = String(req.query.department ?? '').trim()
    const active = String(req.query.active ?? '')
    const conditions: string[] = []
    const values: (string | number)[] = []

    if (search) {
      conditions.push('(CAST(emp_id AS CHAR) LIKE ? OR name LIKE ?)')
      values.push(`%${search}%`, `%${search}%`)
    }
    if (department) {
      conditions.push('department = ?')
      values.push(department)
    }
    if (active === 'true' || active === 'false') {
      conditions.push('active = ?')
      values.push(active === 'true' ? 1 : 0)
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const [rows] = await pool.query(
      `SELECT emp_id, name, salary, department, joining_date, departure_date, active FROM employees ${where} ORDER BY emp_id DESC`,
      values,
    )
    res.json(rows)
  } catch (error) {
    console.error('Failed to list employees:', error)
    res.status(500).json({ message: 'Unable to load employees' })
  }
})

app.get('/api/employees/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute<mysql.RowDataPacket[]>(
      'SELECT emp_id, name, salary, department, joining_date, departure_date, active FROM employees WHERE emp_id = ?',
      [req.params.id],
    )
    if (!rows.length) return res.status(404).json({ message: 'Employee not found' })
    res.json(rows[0])
  } catch (error) {
    console.error('Failed to get employee:', error)
    res.status(500).json({ message: 'Unable to load employee' })
  }
})

function validateEmployee(body: Partial<EmployeeInput>): string | undefined {
  if (!body.name?.trim()) return 'Name is required'
  if (!Number.isFinite(Number(body.salary)) || Number(body.salary) < 0) return 'Salary must be a non-negative number'
  if (!body.department?.trim()) return 'Department is required'
  if (!body.joining_date || Number.isNaN(Date.parse(body.joining_date))) return 'A valid joining date is required'
  if (body.departure_date && Number.isNaN(Date.parse(body.departure_date))) return 'Departure date is invalid'
  return undefined
}

app.post('/api/employees', async (req, res) => {
  const input = req.body as EmployeeInput
  const validationError = validateEmployee(input)
  if (validationError) return res.status(400).json({ message: validationError })
  try {
    const [result] = await pool.execute<mysql.ResultSetHeader>(
      'INSERT INTO employees (name, salary, department, joining_date, departure_date, active) VALUES (?, ?, ?, ?, ?, ?)',
      [input.name.trim(), Number(input.salary), input.department.trim(), input.joining_date, input.departure_date || null, input.active ? 1 : 0],
    )
    const [rows] = await pool.execute<mysql.RowDataPacket[]>(
      'SELECT emp_id, name, salary, department, joining_date, departure_date, active FROM employees WHERE emp_id = ?',
      [result.insertId],
    )
    res.status(201).json(rows[0])
  } catch (error) {
    console.error('Failed to create employee:', error)
    res.status(500).json({ message: 'Unable to create employee' })
  }
})

app.put('/api/employees/:id', async (req, res) => {
  const input = req.body as EmployeeInput
  const validationError = validateEmployee(input)
  if (validationError) return res.status(400).json({ message: validationError })
  try {
    const [result] = await pool.execute<mysql.ResultSetHeader>(
      'UPDATE employees SET name = ?, salary = ?, department = ?, joining_date = ?, departure_date = ?, active = ? WHERE emp_id = ?',
      [input.name.trim(), Number(input.salary), input.department.trim(), input.joining_date, input.departure_date || null, input.active ? 1 : 0, req.params.id],
    )
    if (!result.affectedRows) return res.status(404).json({ message: 'Employee not found' })
    const [rows] = await pool.execute<mysql.RowDataPacket[]>(
      'SELECT emp_id, name, salary, department, joining_date, departure_date, active FROM employees WHERE emp_id = ?',
      [req.params.id],
    )
    res.json(rows[0])
  } catch (error) {
    console.error('Failed to update employee:', error)
    res.status(500).json({ message: 'Unable to update employee' })
  }
})

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const [result] = await pool.execute<mysql.ResultSetHeader>('DELETE FROM employees WHERE emp_id = ?', [req.params.id])
    if (!result.affectedRows) return res.status(404).json({ message: 'Employee not found' })
    res.status(204).end()
  } catch (error) {
    console.error('Failed to delete employee:', error)
    res.status(500).json({ message: 'Unable to delete employee' })
  }
})

app.use((error: unknown, _req: Request, res: Response, _next: express.NextFunction) => {
  void _next
  console.error('Unhandled API error:', error)
  res.status(500).json({ message: 'Unexpected server error' })
})

app.listen(port, () => console.log(`Employee API listening on http://localhost:${port}`))
