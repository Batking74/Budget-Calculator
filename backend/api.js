const express = require('express');
const fs = require('fs');
const serverless = require('serverless-http');
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
.post((req, res) => { createNewRecord(req.body); });

async function getAllRecords() {
    const res = await database.execute(`SELECT * FROM ${process.env.TABLE_NAME}`); return res[0];
}

async function createNewRecord(newSetAside) {
    const date = getDate();
    database.execute(`INSERT INTO ${process.env.TABLE_NAME} (Date, Netpay, SetAsides, Spending_Money, Total_Percentage_Kept) VALUES('${date}', ${JSON.stringify(newSetAside.Netpay)}, '${JSON.stringify(newSetAside.SetAsides)}', ${JSON.stringify(newSetAside.Spending_Money)}, ${JSON.stringify(newSetAside.Percentage_Kept)});`);
}

async function deleteRecord() {
    const res = await database.execute(`SELECT * FROM ${process.env.TABLE_NAME}`);
}

function getDate() {
    const date = new Date();
    return `${date.toUTCString().substring(0, 3)} ${date.toLocaleString()}`;
} setInterval(getDate, 1000);

module.exports.handler = serverless(app);