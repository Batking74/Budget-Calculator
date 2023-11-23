const { createConnection } = require('mysql2');
const { send } = require('./Email');
require('dotenv').config();
const PORT = process.env.PORT || 7000;

// Connecting to mySQL Database
let database;
if(process.env.JAWSDB_URL) {
    database = createConnection(process.env.JAWSDB_URL).promise();
}
else {
    database = createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DATABASE
    }).promise();
}


// Retreives All SetAside Records in SQL Database
async function getAllRecords() {
    const res = await database.execute(`SELECT * FROM ${process.env.TABLE_NAME}`); return res[0];
}


// Creates a new Record/SetAside in SQL Database
async function createNewRecord(newSetAside) {
    const date = getDate();
    database.execute(`INSERT INTO ${process.env.TABLE_NAME} (Date, Netpay, SetAsides, Spending_Money, Total_Percentage_Kept) VALUES('${date}', ${JSON.stringify(newSetAside.Netpay)}, '${JSON.stringify(newSetAside.SetAsides)}', ${JSON.stringify(newSetAside.Spending_Money)}, ${JSON.stringify(newSetAside.Percentage_Kept)});`);
    send(newSetAside);
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

module.exports = { getAllRecords, createNewRecord, deleteRecord, PORT }