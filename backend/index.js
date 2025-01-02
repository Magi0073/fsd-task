// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const mysql = require('mysql2');
// require('dotenv').config();

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Database Connection
// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// // Check Database Connection
// db.getConnection((err, connection) => {
//   if (err) {
//     console.error('Database connection failed:', err.message || err);
//     process.exit(1); // Stop the server if the database is not connected
//   } else {
//     console.log('Database connected successfully!');
//     connection.release(); // Release the connection back to the pool
//   }
// });

// // Routes
// app.get('/', (req, res) => {
//   res.send('Welcome to the Employee Management System!');
// });

// // Add Employee Route
// /* Error styling */
// // Add this in your existing Express server
// app.post('/api/employees/validate', async (req, res) => {
//   const { field, value } = req.body;

//   try {
//     // Dynamically check for duplicates based on the field (email, phoneNumber, or employeeId)
//     const query = `SELECT * FROM employees WHERE ${field} = ?`;
//     const [results] = await db.execute(query, [value]);

//     if (results.length > 0) {
//       return res.status(200).json({ isDuplicate: true });
//     }
//     return res.status(200).json({ isDuplicate: false });
//   } catch (error) {
//     res.status(500).json({ message: 'Database error occurred' });
//   }
// });



//   const query = `
//     INSERT INTO employees (name, employee_id, email, phone_number, department, date_of_joining, role)
//     VALUES (?, ?, ?, ?, ?, ?, ?)
//   `;

//   db.query(
//     query,
//     [name, employeeId, email, phoneNumber, department, dateOfJoining, role],
//     (err, result) => {
//       if (err) {
//         if (err.code === 'ER_DUP_ENTRY') {
//           return res.status(400).json({ message: 'Duplicate Employee ID or Email' });
//         }
//         return res.status(500).json({ message: 'Server Error' });
//       }
//       res.status(201).json({ message: 'Employee added successfully' });
//     }
//   );

// // Start Server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Use promise-based MySQL
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const db = mysql.createPool({
  host: 'junction.proxy.rlwy.net',
  user: 'root',
  password: 'gkwLNMLAAIYJojzYzHmAhAnSpPbZTemk',
  database: 'railway',
  port: 21715,
});

// Check database connection
db.getConnection()
  .then(() => {
    console.log('MySQL Connected...');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err.message);
    process.exit(1);
  });

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Employee Management System!');
});

// Validate Employee Data Route
app.post('/api/employees/validate', async (req, res) => {
  const { field, value } = req.body;

  if (!field || !value) {
    return res.status(400).json({ message: 'Field and value are required' });
  }

  try {
    // Dynamically check for duplicates based on the field
    const query = `SELECT * FROM employees WHERE ${mysql.escapeId(field)} = ?`;
    const [results] = await db.query(query, [value]);

    if (results.length > 0) {
      return res.status(200).json({ isDuplicate: true });
    }
    return res.status(200).json({ isDuplicate: false });
  } catch (error) {
    console.error('Validation Error:', error.message);
    res.status(500).json({ message: 'Database error occurred' });
  }
});

// Add Employee Route
app.post('/api/employees', async (req, res) => {
  const { name, employeeId, email, phoneNumber, department, dateOfJoining, role } = req.body;

  // Input validation
  if (!name || !employeeId || !email || !phoneNumber || !department || !dateOfJoining || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = `
    INSERT INTO employees (name, employee_id, email, phone_number, department, date_of_joining, role)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.query(query, [
      name,
      employeeId,
      email,
      phoneNumber,
      department,
      dateOfJoining,
      role,
    ]);
    res.status(201).json({ message: 'Employee added successfully', employeeId: result.insertId });
  } catch (err) {
    console.error('Insertion Error:', err.message);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Duplicate Employee ID or Email' });
    }
    res.status(500).json({ message: 'Server error occurred' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
