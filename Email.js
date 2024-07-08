// Importing Modules/Packages
const nodemailer = require('nodemailer');
const mailgen = require('mailgen');
const fs = require('fs');
require('dotenv').config();


// Configuring Mail Templates
const generator = new mailgen({
    theme: 'cerberus',
    product: {
        name: "Nazir Knuckles",
        link: "https://budgeting-calculator-878dd6a27579.herokuapp.com/",
        logo: './assets/Budget_Calculator_Project.png',
        copyright: `Nazir Knuckles`
    }
})


// Configuring nodemailer for sending emails
const transporter = nodemailer.createTransport(
    {
        host: process.env.HOST,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    }
)


function send(Netpay, SetAsides, Percentage_Kept, Spending_Money) {
    // Designing email markup 
    const gen = {
        body: {
            name: 'Naz!',
            intro: `Congratulations on your new logged SetAside!! You have ${Spending_Money} left to spend for your self! Which means you kept ${Percentage_Kept} of your original Netpay (${Netpay})!`,
            table: {
                data: SetAsides
            },
            signature: false
        }
    }

    // Creating Custom Invoice
    fs.readFile('./public/index.html', 'utf-8', (err, data) => {
        if(err) throw err;
        const options = {
            to: process.env.RECIPIENTS.split(', '),
            from: `Nazir's Budgeting Calculator <${process.env.EMAIL}>`,
            subject: "Naz NEW SetAside Log Budget Review!!",
            html: generator.generate(gen)
        }

        // Transporting Email over TCP/IP
        transporter.sendMail(options, (error, info) => {
            if(error) throw error;
            console.log(info.messageId);
        });
    });
}


// Exporting Module
module.exports = { send }