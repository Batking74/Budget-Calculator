const { createConnection } = require('mysql2');
const express = require('express');
require('dotenv').config();
const fs = require('fs');
const temp = new Date();
const app = express();
app.use(express.static('../public'));

const database = createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DATABASE
}).promise();

async function getAllRecords() {
    const res = await database.execute(`SELECT * FROM ${process.env.TABLE_NAME}`);
    return res[0];
}

async function createNewRecord(newSetAsides) {
    const date = `${temp.toUTCString().substring(0, 16)}`;
    database.execute(`INSERT INTO ${process.env.TABLE_NAME} (Date, SetAsides) VALUES('${date}', '${JSON.stringify(newSetAsides)}');`);
}

async function deleteRecord() {
    const res = await database.execute(`SELECT * FROM ${process.env.TABLE_NAME}`);
    console.log(res[0])
}

app.get('/', (req, res) => {
    fs.readFile('./index.html', 'utf8', (err, HTML) => {
        res.send(HTML);
    })
})

app.get('/logs', async (req, res) => {
    res.send(await getAllRecords());
});

app.listen(7000, () => {
    console.log('Listening on port 7000')
})