const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const { createConnection } = require('mysql2');
require('dotenv').config();
const app = express();
app.use(express.static('../public'));
app.use(express.json());

// Connecting to mySQL Database
const database = createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DATABASE
}).promise();

// Setting up Routs
app.get('/', (req, res) => { fs.readFile('./index.html', 'utf8', (err, HTML) => res.send(HTML)); });
app.route('/setAside')
.get(async (req, res) => res.send(await getAllRecords()))
.post((req, res) => {
    createNewRecord(req.body);
    res.send(JSON.stringify("Aria botoy hole!"));
})

// Handling Delete SetAside Record Request (Deletes the Specified Record by the User from database)
app.delete('/setAside/:id', (req, res) => {
    deleteRecord(parseInt(req.params.id));
    res.send(JSON.stringify('Deleted Sucessfully!'));
})

// Server Port
app.listen(7000, () => {
    console.log('Listening on port 7000');
})

// Retreives All SetAside Records in SQL Database
async function getAllRecords() {
    const res = await database.execute(`SELECT * FROM ${process.env.TABLE_NAME}`); return res[0];
}

// Creates a new Record/SetAside in SQL Database
async function createNewRecord(newSetAside) {
    const date = getDate();
    database.execute(`INSERT INTO ${process.env.TABLE_NAME} (Date, Netpay, SetAsides, Spending_Money, Total_Percentage_Kept) VALUES('${date}', ${JSON.stringify(newSetAside.Netpay)}, '${JSON.stringify(newSetAside.SetAsides)}', ${JSON.stringify(newSetAside.Spending_Money)}, ${JSON.stringify(newSetAside.Percentage_Kept)});`);
}

// Deletes a Record/SetAside from SQL Database
async function deleteRecord(id) {
    const res = await database.execute(`DELETE FROM ${process.env.TABLE_NAME} WHERE id=${id}`);
}

// Returns the current date and Time
function getDate() {
    const date = new Date();
    return `${date.toUTCString().substring(0, 3)} ${date.toLocaleString()}`;
} setInterval(getDate, 1000);