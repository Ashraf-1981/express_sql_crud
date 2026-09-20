
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
// Cuisines routes (Task 8)
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


// 'D' show confirm delete page
app.get('/confirm_delete_cuisine/:id', async function (req, res) {
    const id = req.params.id;
    const [rows] = await dbConnection.execute(
        "SELECT * FROM cuisines WHERE cuisine_id = ?",
        [id]
    );
    res.render('confirm_delete_cuisine', {
        cuisine: rows[0]
    });
});

// 'D' actually delete
app.post('/confirm_delete_cuisine/:id', async function (req, res) {
    const id = req.params.id;
    const sql = "DELETE FROM cuisines WHERE cuisine_id = ?";
    await dbConnection.execute(sql, [id]);
    res.redirect('/cuisines');
});


// ==========================================
// Recipes routes (Task 9)
// ==========================================

// 'R' list all recipes
app.get('/recipes', async function (req, res) {
    const sql = `SELECT * FROM recipes
        JOIN cuisines ON recipes.cuisine_id = cuisines.cuisine_id
        JOIN users ON recipes.user_id = users.user_id
    `;

    const results = await dbConnection.execute({
        sql: sql,
        nestTables: true
    });

    const rows = results[0];

    res.render('list-recipes', {
        recipes: rows
    });
});

// 'C' show create recipe form
app.get('/recipes/create', async function (req, res) {
    const [cuisines] = await dbConnection.execute("SELECT * FROM cuisines");
    const [users] = await dbConnection.execute("SELECT * FROM users");

    res.render('create-recipes', {
        cuisines: cuisines,
        users: users
    });
});

// 'C' process form and insert new recipe
app.post('/recipes/create', async function (req, res) {
    const { title, instructions, cuisine_id, user_id } = req.body;
    const sql = `INSERT INTO recipes (title, instructions, cuisine_id, user_id)
                 VALUES (?, ?, ?, ?)`;
    await dbConnection.execute(sql, [title, instructions, cuisine_id, user_id]);
    res.redirect('/recipes');
});


// Search recipes
app.get('/search/recipes', async function (req, res) {
    const { title, cuisine_id, date_created, last_updated } = req.query;

    // query builder pattern
    let query = `SELECT * FROM recipes
        JOIN cuisines ON recipes.cuisine_id = cuisines.cuisine_id
        JOIN users ON recipes.user_id = users.user_id
        WHERE 1
    `;
    const bindings = [];

    if (title) {
        query += " AND recipes.title LIKE ?";
        bindings.push("%" + title + "%");
    }
    if (cuisine_id) {
        query += " AND recipes.cuisine_id = ?";
        bindings.push(cuisine_id);
    }
    if (date_created) {
        query += " AND DATE(recipes.date_created) = ?";
        bindings.push(date_created);
    }
    if (last_updated) {
        query += " AND DATE(recipes.last_updated) = ?";
        bindings.push(last_updated);
    }

    
    const results = await dbConnection.execute({
        sql: query,
        values: bindings,
        nestTables: true
    });
    const rows = results[0];

    const [cuisines] = await dbConnection.execute("SELECT * FROM cuisines");

    res.render('search-recipes', {
        results: rows,
        cuisines: cuisines,
        values: req.query
    });
});


// 'U' show edit recipe form
app.get('/recipes/:id/edit', async function (req, res) {
    const id = req.params.id;

    const [recipes] = await dbConnection.execute(
        "SELECT * FROM recipes WHERE recipe_id = ?",
        [id]
    );
    const [cuisines] = await dbConnection.execute("SELECT * FROM cuisines");
    const [users] = await dbConnection.execute("SELECT * FROM users");

    res.render('edit-recipes', {
        recipe: recipes[0],
        cuisines: cuisines,
        users: users
    });
});

// 'U' save recipe changes
app.post('/recipes/:id/edit', async function (req, res) {
    const id = req.params.id;
    const { title, instructions, cuisine_id, user_id } = req.body;
    const sql = `UPDATE recipes
                 SET title = ?, instructions = ?, cuisine_id = ?, user_id = ?
                 WHERE recipe_id = ?`;
    await dbConnection.execute(sql, [title, instructions, cuisine_id, user_id, id]);
    res.redirect('/recipes');
});


// 'D' show confirm delete recipe page
app.get('/confirm_delete_recipe/:id', async function (req, res) {
    const id = req.params.id;
    const [rows] = await dbConnection.execute(
        "SELECT * FROM recipes WHERE recipe_id = ?",
        [id]
    );
    res.render('confirm_delete_recipe', {
        recipe: rows[0]
    });
});

// 'D' actually delete recipe
app.post('/confirm_delete_recipe/:id', async function (req, res) {
    const id = req.params.id;
    const sql = "DELETE FROM recipes WHERE recipe_id = ?";

    await dbConnection.execute(sql, [id]);
    res.redirect('/recipes');
});




app.listen(port, function () {
    // console.log(`Server has started on port ${port}`);
    console.log(`Server has started on port ${port}`);
});