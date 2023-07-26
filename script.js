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
const clearBtn = document.getElementById('clearBtn');
const resultContainer = document.getElementById('results');
const saveResults = document.getElementById('save-aside-results');
const billsResults = document.getElementById('bill-saide-results');
const netPayResults = document.getElementById('netpay-aside-results');
const percentKeptResults = document.getElementById('total-percentage-kept-results');

inputOptions.insertAtHead(null);
inputOptions.insertAtHead(null);
inputOptions.insertAtHead(billsOption);
inputOptions.insertAtHead(saveOption);
calcResults.insertAtHead(percentKeptResults);
calcResults.insertAtHead(netPayResults);
calcResults.insertAtHead(billsResults);
calcResults.insertAtHead(saveResults);
messages.insertAtHead('You Keep');
messages.insertAtHead('Spending Money');
messages.insertAtHead('Bills Set Aside');
messages.insertAtHead('Save Set Aside');

let count = 2;
let count2 = 3;
let count3 = 2;
const empty = '';
const containerLength = calcResults.length;
const end = [containerLength - 1, containerLength - 2, (containerLength - 1) + 2, (containerLength - 2) + 1];

setAsideBtn.addEventListener('click', () => addSetAside(prompt('What is the name of this set aside?')));
document.addEventListener('keyup', (key) => { if(key.key === 'Enter') calculate() });
calcBtn.addEventListener('click', () => calculate());
    
function calculate() {
    const value = document.body.children[1].children[count2 - 1].children[1].value;
    if(inputOptions.getIndex(2).value != undefined && inputOptions.getIndex(3).value != undefined) {
        if(inputOptions.length > 4 && value != undefined) inputOptions.getIndex(count).value = value;
    }
    if(netIncome.value === empty) alert('Must have a net income!');
    else {
        const msg = getNodeFrom(messages, end[1]);
        const num = (msg.length) + 2;
        console.log(inputOptions)
        inputOptions.getIndex(0).value = saveOption.value;
        inputOptions.getIndex(1).value = billsOption.value;
        const netPayElement = getNodeFrom(calcResults, end[1]);
        netPayElement.textContent = `${msg}: $${netIncome.value}`;
        calcResults.getIndex(end[0]).textContent = empty;
        for(let i = 0; i < inputOptions.length; i++) {
            let te = null;
            const e = document.body.children[1].getElementsByTagName('div').length -1;
            const t = document.body.children[1].getElementsByTagName('div')[e].children[0].textContent;
            const msgValue = getNodeFrom(messages, i);
            let input = getNodeFrom(inputOptions, i);
            if(count3 > 2 && i != 0 && i != 1 && t != 'Bills') {
                input = document.body.children[1].getElementsByTagName('div')[e].children[1].value;
            }
            const resultElement = document.body.children[5].getElementsByTagName('p')[i];
            validateOptions(num, input, resultElement, netPayElement, msgValue);
        }
    }
}

function validateOptions(num, input, resultElement, netPayElement, msgValue) {
    if(input === empty) resultElement.textContent = empty;
    else {
        if(input === null || input === undefined) return;
        // Calculating Net Pay and Set Aside Amounts
        const netPay = parseFloat(removeChar(netPayElement.textContent.substring(num)));
        const percentage = (netPay * (input / 100)).toFixed(2);
        const newNetPay = (netPay - percentage).toFixed(2);
        
        // Calculating Total Percentage Saved
        const saved = ((newNetPay / netIncome.value) * 100).toFixed(0);
        displayCalcResults(newNetPay, percentage, saved, input, resultElement, netPayElement, msgValue);
    }
}

function displayCalcResults(newNetPay, percentage, saved, input, resultElement, netPayElement, msgValue) {
    console.log(`${newNetPay}, ${percentage}, ${saved}, ${input}, ${resultElement.textContent}, ${netPayElement.textContent}, ${msgValue}`)
    const msg = getNodeFrom(messages, end[1]);
    const amountSavedElement = getNodeFrom(calcResults, end[0]);
    if(msgValue != empty) {
        resultElement.textContent = `${msgValue} ${input}%: -$${percentage}`;
        netPayElement.textContent = `${msg}: $${newNetPay.toLocaleString()}`;
        amountSavedElement.textContent = `${getNodeFrom(messages, end[0])} ${saved}% of Your Net Pay!`;
    }
    // else netPayElement.textContent = `${msg}: $${newNetPay.toLocaleString('en-US')}`;
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
    if(label === null) return;
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
    newLabel.appendChild(newText);
    
    newResultElement.setAttribute('class', 'calculation-results');
    calcResults.insertAtIndex(2, newResultElement);
    resultContainer.insertBefore(newResultElement, resultContainer.children[3]);
    
    messages.insertAtIndex(2, `${label} Set Aside`);
    if(count === 2) inputOptions.insertAtIndex(count, newInput.value);
    else if(count === 3) inputOptions.insertAtIndex(count, newInput.value);
    else inputOptions.insertAtIndex(inputOptions.length - 1, newInput.value);
    count++;
    count2++;
    count3++;
}
const getNodeFrom = (list, index) => { return list.getIndex(index).value; }