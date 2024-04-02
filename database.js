// Importing Modules/Packages
const { createConnection } = require('mysql2');
const { send } = require('./Email');
require('dotenv').config();
const PORT = process.env.PORT || 6000;


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
    const res = await database.execute(`SELECT * FROM SetAsides`); return res[0];
}


// Creates a new Record/SetAside in SQL Database
async function createNewRecord({ Netpay, SetAsides, Spending_Money, Percentage_Kept, Date }) {
    const sqlQuery = `INSERT INTO SetAsides(Date, Netpay, SetAsides, Spending_Money, Total_Percentage_Kept) VALUES(?, ?, ?, ?, ?);`;
    database.execute(sqlQuery, [Date, Netpay, SetAsides, Spending_Money, Percentage_Kept]);
    send(Netpay, SetAsides, Spending_Money, Percentage_Kept);
}


// Deletes a Record/SetAside from SQL Database
async function deleteRecord(id) {
    const res = await database.execute(`DELETE FROM SetAsides WHERE id=${id}`);
}


// Exporting Modules
module.exports = { getAllRecords, createNewRecord, deleteRecord, PORT }