import LinkedList from "./linkedlist.js";
const inputOptions = new LinkedList();
const calcResults = new LinkedList();
const messages = new LinkedList();
const mainContainer = document.getElementById('main-container');
const netIncome = document.getElementById('net-income');
const saveOption = document.getElementById('save-option');
const billsOption = document.getElementById('bills-option');
const calcBtn = document.getElementById('btn');
const setAsideBtn = document.getElementById('set-aside-btn');
const clearBtn = document.getElementById('clear-btn');
const resultContainer = document.getElementById('results');
const saveResults = document.getElementById('save-aside-results');
const billsResults = document.getElementById('bill-saide-results');
let netPayResults = document.getElementById('netpay-aside-results');
let percentKeptResults = document.getElementById('total-percentage-kept-results');

inputOptions.insertAtHead(billsOption);
inputOptions.insertAtHead(saveOption);
calcResults.insertAtHead(billsResults);
calcResults.insertAtHead(saveResults);
messages.insertAtHead('Bills Set Aside');
messages.insertAtHead('Save Set Aside');

let numberOfSetAside = 0;
let count2 = 3;
let count3 = 2;
const inputListLength = 2;
const empty = '';
const containerLength = calcResults.length;
const end = [containerLength - 1, containerLength - 2, (containerLength - 1) + 2, (containerLength - 2) + 1];

setAsideBtn.addEventListener('click', () => {
    if(document.body.children[1].children[count2 - 1].children[1].value === empty) {
        console.log('All inputs must be used!')
        return;
    }
    else { addSetAside(prompt('What is the name of this set aside?')); }
})
document.addEventListener('keyup', (key) => { if(key.key === 'Enter') calculate() });
calcBtn.addEventListener('click', () => calculate());
clearBtn.addEventListener('click', () => {
    for(let i = 0; i < inputOptions.length; i++) {
        netIncome.value = empty;
        inputOptions.getIndex(i).value.value = empty;
    }
})

function calculate() {
    console.log(inputOptions)
    const value = document.body.children[1].children[count2 - 1].children[1].value;
    if(netIncome.value === empty) alert('Must have a net income!');
    else {
        const msg = getNodeFrom(messages, end[1]);
        const num = (msg.length) + 2;
        netPayResults.textContent = `${msg}: $${netIncome.value}`;
        // netPayResults.textContent = empty;
        for(let i = 0; i < inputOptions.length; i++) {
            const e = document.body.children[1].getElementsByTagName('div').length -1;
            let s = document.body.children[1].getElementsByTagName('div')[inputOptions.length].childNodes[1].id;
            console.log(s)

            const t = document.body.children[1].getElementsByTagName('div')[inputOptions.l - 1];
            if(inputOptions.length > inputListLength && value != undefined && s === 'user-new-setAside') {
                inputOptions.getIndex(2).value = document.body.children[1].children[count2 - 1].children[1];
                console.log(inputOptions)
            }
            const msgValue = getNodeFrom(messages, i);
            let input = getNodeFrom(inputOptions, i);
            // if(count3 > 2 && i != 0 && i != 1 && t != 'Bills') {
            //     input = document.body.children[1].getElementsByTagName('div')[e].children[1].value;

            // }

            validateOptions(i, num, input, msgValue);
        }
    }
}

function validateOptions(i, num, input, msgValue) {
        if(input.value === empty) calcResults.getIndex(i).value.textContent = empty;
        else if(input.value === null || input.value === undefined) return;
        else {
            // Calculating Net Pay and Set Aside Amounts
            const netPay = parseFloat(removeChar(netPayResults.textContent.substring(num)));
            const percentage = (netPay * (input.value / 100)).toFixed(2);
            const newNetPay = (netPay - percentage).toFixed(2);
            
            // Calculating Total Percentage Saved
            const saved = ((newNetPay / netIncome.value) * 100).toFixed(0);
            displayCalcResults(i, newNetPay, percentage, saved, input, msgValue);
        }
}

function displayCalcResults(i, newNetPay, percentage, saved, input, msgValue) {
    calcResults.getIndex(i).value.textContent = `${msgValue} ${input.value}%: -$${percentage}`;
    netPayResults.textContent = `Spending Money: $${newNetPay.toLocaleString()}`;
    percentKeptResults.textContent = `You Keep ${saved}% of Your Net Pay!`
}

function removeChar(string) {
    let newString = '';
    for(let i = 0; i < string.length; i++) {
        let letter = string.substring(i, i + 1);
        if(letter === ',') letter = '';
        else if(letter === '$') letter = '';
        else newString += letter;
    }
    return newString;
}

function addSetAside(label) {
    if(label === null || label === empty) return;
    const setAsideDiv = document.createElement('div');
    const newText = document.createTextNode(label);
    const newLabel = document.createElement('label');
    const newInput = document.createElement('input');
    const newResultElement = document.createElement('p');
    mainContainer.appendChild(setAsideDiv);
    setAsideDiv.appendChild(newLabel);
    setAsideDiv.appendChild(newInput);
    
    newInput.setAttribute('type', 'number');
    newInput.setAttribute('placeholder', '%');
    newInput.setAttribute('id', 'user-new-setAside');
    newLabel.appendChild(newText);
    
    newResultElement.setAttribute('class', 'calculation-results');
    resultContainer.insertBefore(newResultElement, resultContainer.children[3]);
    calcResults.insertAtIndex(2, newResultElement);
    messages.insertAtIndex(2, `${label} Set Aside`);
    inputOptions.insertAtIndex(2, newInput.value);
    
    numberOfSetAside++;
    count2++;
    count3++;
}
const getNodeFrom = (list, index) => { return list.getIndex(index).value; }