CREATE DATABASE IF NOT EXISTS employee_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE employee_management;

CREATE TABLE IF NOT EXISTS employees (
  emp_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  salary DECIMAL(12, 2) NOT NULL DEFAULT 0,
  department VARCHAR(80) NOT NULL,
  joining_date DATE NOT NULL,
  departure_date DATE NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (emp_id),
  INDEX idx_employees_department (department),
  INDEX idx_employees_active (active),
  CONSTRAINT chk_employee_salary CHECK (salary >= 0)
);

-- Optional sample rows for a quick dashboard preview.
INSERT INTO employees (name, salary, department, joining_date, departure_date, active) VALUES
  ('Aarav Mehta', 82000.00, 'Engineering', '2022-04-18', NULL, TRUE),
  ('Maya Patel', 76000.00, 'Design', '2021-08-02', NULL, TRUE),
  ('Noah Williams', 68000.00, 'People', '2020-11-16', '2024-06-30', FALSE),
  ('Priya Sharma', 91000.00, 'Engineering', '2019-01-07', NULL, TRUE),
  ('Oliver Chen', 72000.00, 'Finance', '2023-03-20', NULL, TRUE);
