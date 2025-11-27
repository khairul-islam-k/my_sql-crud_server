require('dotenv').config()
const mysql = require("mysql2");
const express = require('express');
const cors = require("cors");
const app = express()
const port = process.env.PORT || 3000;

// middleware
app.use(cors())
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.HOST_NAME,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.MYSQLPORT // your database name
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Get all users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM students", (err, data) => {
    if (err) return res.json(err);
    res.json(data);
  });
});

// last one data
app.get("/lastData", (req, res) => {
  const sql = "SELECT Roll FROM students ORDER  BY Roll DESC LIMIT 1";

  db.query(sql,(error, data) => {
    if (error) {
      return console.log(error);
    }

    res.send(data);
  })
})

app.get("/user/:roll", (req, res) => {
  const Roll = req.params.roll;

  const sql = `SELECT * FROM students
  WHERE Roll = ?`;
  db.query(sql, [Roll], (error, result) => {
    if (error) {
      return console.log(error);
    }
    res.send(result);
  })
})


app.post("/user", (req, res) => {
  const {Roll, name, email, gender, department, district, fatherName } = req.body;

  const sql = `INSERT INTO students (Roll, Name, Gender, Department, District, FatherName, Email)
  VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const values = [Roll, name, gender, department, district, fatherName, email];

  db.query(sql, values, (error, data) => {
    if (error) {
      return res.send(error);
    }
    res.send({ insertId: data.insertId });
  })
})

app.put("/user/:roll", (req, res) => {
  const Roll = req.params.roll;
  const { name, email, gender, department, district, fatherName } = req.body;

  const sql = `UPDATE students 
    SET Name = ?, Email = ?, Gender = ?, Department = ?, District = ?, FatherName = ?
    WHERE Roll = ?`;
  const values = [name, email, gender, department, district, fatherName, Roll];

  db.query(sql, values, (error, result) => {
    if (error) {
      return console.log(error);
    }

    res.send({ changedRows: result.changedRows });
  })
})

app.delete("/user/:roll", (req, res) => {
  const Roll = req.params.roll;

  const sql = `DELETE FROM students
  WHERE Roll = ?`;
  db.query(sql, [Roll], (error, result) => {
    if (error) {
      return console.log(error);
    }
    res.send({ affectedRows: result.affectedRows });
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
