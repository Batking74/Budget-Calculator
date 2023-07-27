import LinkedList from "./linkedlist.js";
const inputOptions = new LinkedList();
const calcResults = new LinkedList();
const setAsideMsg = new LinkedList();
const mainContainer = document.getElementById('main-container');
let netIncome = document.getElementById('net-income');
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
setAsideMsg.insertAtHead('Bills Set Aside');
setAsideMsg.insertAtHead('Save Set Aside');
const text = [
    'All inputs must be used!',
    'What is the name of this set aside?',
    'Must have a net income!',
    'user-new-setAside',
    'calculation-results'
]

let numberOfSetAside = 0;
const empty = '';
let count2 = 3;
let count3 = 2;

setAsideBtn.addEventListener('click', () => {
    if(hasNetIncome()) {
        for(let i = 0; i < inputOptions.length; i++) {
            if(inputOptions.getIndex(i).value.value === empty) inputOptions.getIndex(i).value.value = 0;
        }
        validateSetAsides();
        addSetAside(prompt(text[1]));
    }
})
document.addEventListener('keyup', (key) => { if(key.key === 'Enter') validateSetAsides() });
calcBtn.addEventListener('click', () => validateSetAsides());
clearBtn.addEventListener('click', () => {
    for(let i = 0; i < inputOptions.length; i++) {
        netIncome.value = empty;
        inputOptions.getIndex(i).value.value = empty;
    }
})

function validateSetAsides() {
    const netPayValue = netIncome.value;
    if(hasNetIncome()) {
        const msg = getNodeFrom(setAsideMsg, setAsideMsg.length - 2);
        const num = (msg.length) + 2;
        netPayResults.textContent = `${msg}: $${netPayValue}`;
        for(let i = 0; i < inputOptions.length; i++) {
            hasNewSetAsides();
            const label = getNodeFrom(setAsideMsg, i);
            let inputData = getNodeFrom(inputOptions, i);
            if(inputData.value === empty) getNodeFrom(calcResults, i).textContent = empty;
            else if(inputData.value === undefined) return;
            else calculate(netPayValue, inputData, label, num, i);
        }
    }
}

function hasNewSetAsides() {
    const newSetAsideValue = getNewSetAside().value;
    let setAsideId = getInputDivs()[inputOptions.length].childNodes[1].id;
    if(inputOptions.length > 2 && newSetAsideValue != undefined && setAsideId === text[3]) {
        inputOptions.getIndex(2).value = mainContainer.children[count2 - 1].children[1];
        return true;
    }
    else return false;
}

function calculate(netPayValue, inputData, label, num, i) {
    // Calculating Net Pay and Set Aside Amounts
    const netPay = parseFloat(removeChar(netPayResults.textContent.substring(num)));
    const setAsideAmount = (netPay * (inputData.value / 100)).toFixed(2);
    const newNetPay = (netPay - setAsideAmount).toFixed(2);
    
    // Calculating Total Percentage Saved
    const percentageSaved = ((newNetPay / netPayValue) * 100).toFixed(0);
    displayCalcResults(newNetPay, inputData, label, setAsideAmount, percentageSaved, i);
}
    
function displayCalcResults(newNetPay, inputData, label, setAsideAmount, percentageSaved, i) {
    getNodeFrom(calcResults, i).textContent = `${label} ${inputData.value}%: -$${setAsideAmount}`;
    netPayResults.textContent = `Spending Money: $${newNetPay.toLocaleString()}`;
    percentKeptResults.textContent = `You Keep ${percentageSaved}% of Your Net Pay!`;
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
    newInput.setAttribute('id', text[3]);
    newLabel.appendChild(newText);
    newResultElement.setAttribute('class', text[4]);

    resultContainer.insertBefore(newResultElement, resultContainer.children[3]);
    calcResults.insertAtIndex(2, newResultElement);
    setAsideMsg.insertAtIndex(2, `${label} Set Aside`);
    inputOptions.insertAtIndex(2, newInput.value);
    
    numberOfSetAside++;
    count2++;
    count3++;
}

const getNodeFrom = (list, index) => { return list.getIndex(index).value; }
function getNewSetAside() { return mainContainer.children[count2 - 1].children[1] }
function getInputDivs() { return mainContainer.getElementsByTagName('div'); }
function hasNetIncome() {
    if(netIncome.value === empty) { alert(text[2]); return false; }
    else return true;
}