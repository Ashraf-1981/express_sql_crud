console.log("VERSION 2 LOADED");

const express = require('express');
const mysql2 = require('mysql2/promise');
const ejs = require('ejs');

const app = express();
const port = 3000;

require('dotenv').config();

// Tell Express we are using EJS as the view engine.
// A view engine is also known as a template engine.
app.set('view engine', 'ejs');
app.set('views', './views');

// Allow Express to process data submitted through HTML forms.
app.use(express.urlencoded({
    extended: true
}));

// Create a connection pool to the database.
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

const dbConnection = mysql2.createPool(dbConfig);


// ==========================================
// Routes
// ==========================================

// Students add their routes here.

// create 'C' and a blank form + cuisine route
app.get("/cuisines/create", function (req, res) {
    res.render('create-cuisines');
});

// 'C' procees a form and Insert a new cuisine into the database.
app.post('/cuisines/create', async function (req, res) {
    const { name } = req.body;
    const sql = "INSERT INTO cuisines (name) VALUES (?)";
    await dbConnection.execute(sql, [name]);
    res.redirect('/cuisines');
});

// List 'R' all cuisines route
app.get('/cuisines', async function (req, res) {
    const [rows] = await dbConnection.execute("SELECT * FROM cuisines");
    res.render('list-cuisines', {
        cuisines: rows
    });
});

// 'U' show edit form
app.get('/cuisines/:id/edit', async function (req, res) {
    const id = req.params.id;
    const [rows] = await dbConnection.execute(
        "SELECT * FROM cuisines WHERE cuisine_id = ?",
        [id]
    );
    res.render('edit-cuisines', {
        cuisine: rows[0]
    });
});

// 'U' save changes
app.post('/cuisines/:id/edit', async function (req, res) {
    const id = req.params.id;
    const { name } = req.body;
    const sql = "UPDATE cuisines SET name = ? WHERE cuisine_id = ?";
    await dbConnection.execute(sql, [name, id]);
    res.redirect('/cuisines');
});

// 'D' delete a cuisine
app.post('/cuisines/:id/delete', async function (req, res) {
     console.log("DELETE ROUTE HIT, id =", req.params.id);
    const id = req.params.id;
    const sql = "DELETE FROM cuisines WHERE cuisine_id = ?";
    await dbConnection.execute(sql, [id]);
    res.redirect('/cuisines');
});




app.listen(port, function () {
    console.log(`Server has started on port ${port}`);
});