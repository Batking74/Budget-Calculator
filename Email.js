const nodemailer = require('nodemailer');
const mailgen = require('mailgen');
const fs = require('fs');
require('dotenv').config();

const generator = new mailgen({
    theme: 'cerberus',
    product: {
        name: "Nazir Knuckles",
        link: "https://budgeting-calculator-878dd6a27579.herokuapp.com/",
        logo: './assets/Budget_Calculator_Project.png',
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

function send(Netpay, SetAsides, Percentage_Kept, Spending_Money) {
    const gen = {
        body: {
            name: 'Naz!',
            intro: `Congradulations on your new logged SetAside!! You have ${Spending_Money} left to spend for your self! Which means you kept ${Percentage_Kept} of your original Netpay (${Netpay})!`,
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
            to: process.env.RECIPIENT,
            from: `Nazir's Budgeting Calculator <${process.env.USERNAME}>`,
            subject: "Naz NEW SetAside Log Budget Review!!",
            html: generator.generate(gen)
        }
    
        transporter.sendMail(options, (err, info) => {
            if(err) console.log(err)
            console.log(info.messageId)
        })
    })
}


// Exporting Module
module.exports = { send }