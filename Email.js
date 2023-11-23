const nodemailer = require('nodemailer');
const mailgen = require('mailgen');
require('dotenv').config();

const generator = new mailgen({
    theme: 'cerberus',
    product: {
        name: "Nazir Knuckles",
        link: "http://localhost:7000/",
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


module.exports = { send }