const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const mailgen = require('mailgen');
const { createConnection } = require('mysql2');
require('dotenv').config();
const app = express();
app.use(express.static('../Budget-Calculator'));
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


const generator = new mailgen({
    theme: 'cerberus',
    product: {
        name: "Nazir Knuckles",
        link: "http://localhost:7000/",
        logo: '/assets/Budget_Calculator_Project.png',
        copyright: `Nazir Knuckles`
    }
})

const transporter = nodemailer.createTransport(
    {
        host: process.env.HOST,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    }
)

function send(newSetAside) {
    const gen = {
        body: {
            name: 'Naz!',
            intro: `Congradulations on your new logged SetAside!! You have ${newSetAside.Spending_Money} left to spend for your self! Which means you kept ${newSetAside.Percentage_Kept} of your original Netpay (${newSetAside.Netpay})!`,
            table: {
                data: newSetAside.SetAsides
            },
            signature: false
        }
    }

    const options = {
        to: process.env.RECIPIENT,
        from: `Nazir's Budgeting Calculator <${process.env.USERNAME}>`,
        subject: "Naz NEW SetAside Log Budget Review!!",
        html: generator.generate(gen)
    }

    transporter.sendMail(options, (err, info) => {
        if(err) console.log(err)
        console.log(info.messageId)
    })
}

