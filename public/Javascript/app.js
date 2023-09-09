const express = require('express');
const fs = require('fs');
<<<<<<<< HEAD:backend/api.js
const serverless = require('serverless-http');
========
const bcrypt = require('bcrypt');
>>>>>>>> 0a10839a58a46981e19c813cc9f5bbb6fd0dce78:public/Javascript/app.js
const { createConnection } = require('mysql2');
require('dotenv').config();
const app = express();
const router = express.Router();

app.use(express.json());
app.use('/.netlify/functions/api', router);

const database = createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DATABASE
}).promise();

router.get('/', (req, res) => { fs.readFile('./index.html', 'utf8', (err, HTML) => res.send(HTML)); });
router.route('/setAsides')
.get(async (req, res) => res.send(await getAllRecords()))
<<<<<<<< HEAD:backend/api.js
.post((req, res) => { createNewRecord(req.body); });
========
.post((req, res) => {
    createNewRecord(req.body);
    res.send(JSON.stringify("Aria botoy hole!"));
})

app.delete('/setAside/:id', (req, res) => {
    deleteRecord(parseInt(req.params.id));
    res.send(JSON.stringify('Deleted Sucessfully!'));
})

app.listen(7000, () => {
    console.log('Listening on port 7000');
})
>>>>>>>> 0a10839a58a46981e19c813cc9f5bbb6fd0dce78:public/Javascript/app.js

async function getAllRecords() {
    const res = await database.execute(`SELECT * FROM ${process.env.TABLE_NAME}`); return res[0];
}

async function createNewRecord(newSetAside) {
    const date = getDate();
    database.execute(`INSERT INTO ${process.env.TABLE_NAME} (Date, Netpay, SetAsides, Spending_Money, Total_Percentage_Kept) VALUES('${date}', ${JSON.stringify(newSetAside.Netpay)}, '${JSON.stringify(newSetAside.SetAsides)}', ${JSON.stringify(newSetAside.Spending_Money)}, ${JSON.stringify(newSetAside.Percentage_Kept)});`);
}

async function deleteRecord(id) {
    const res = await database.execute(`DELETE FROM ${process.env.TABLE_NAME} WHERE id=${id}`);
}

function getDate() {
    const date = new Date();
    return `${date.toUTCString().substring(0, 3)} ${date.toLocaleString()}`;
} setInterval(getDate, 1000);

module.exports.handler = serverless(app);