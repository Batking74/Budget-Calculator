import LinkedList from "./linkedlist.js";
const mainContainer = document.getElementById('main-container');
let netIncome = document.getElementById('net-income');
const saveOption = document.getElementById('save-option');
const billsOption = document.getElementById('bills-option');
const calcBtn = document.getElementById('btn');
const setAsideBtn = document.getElementById('set-aside-btn');
const clearBtn = document.getElementById('clear-btn');
const calcPercentageBtn1 = document.getElementById('calc-percent-btn-1');
const calcFixedNumBtn1 = document.getElementById('calc-fixedNum-btn-1');
const calcPercentageBtn2 = document.getElementById('calc-percent-btn-2');
const calcFixedNumBtn2 = document.getElementById('calc-fixedNum-btn-2');
const resultContainer = document.getElementById('results');
const saveResults = document.getElementById('save-aside-results');
const billsResults = document.getElementById('bill-saide-results');
let netPayResults = document.getElementById('netpay-aside-results');
let percentKeptResults = document.getElementById('total-percentage-kept-results');
const inputOptions = new LinkedList();
const calcResults = new LinkedList();
const setAsideMsg = new LinkedList();
const percentCalc = new LinkedList();
const fixedNumCalc = new LinkedList();

percentCalc.insertAtHead(calcPercentageBtn2);
percentCalc.insertAtHead(calcPercentageBtn1);
fixedNumCalc.insertAtHead(calcFixedNumBtn2);
fixedNumCalc.insertAtHead(calcFixedNumBtn1);
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
];

let numberOfSetAside = 0;
let counter = 3;
const empty = '';
const containerLength = calcResults.length;
const clacOption = [percentCalc, fixedNumCalc];

listenForCalcOption();
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
        const msg = getNodeFrom(setAsideMsg, containerLength - 2);
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
        inputOptions.getIndex(inputOptions.length - 1).value = mainContainer.children[counter - 1].children[1];
        return true;
    }
    else return false;
}

function calculate(netPayValue, inputData, label, num, i) {
    const netPay = parseFloat(removeChar(netPayResults.textContent.substring(num)));
    const isPercentCalculation = percentCalc.getIndex(i).value.autofocus;
    let setAsideAmount = (inputData.value);
    let value = calculateNewNetPay(netPay, netPayValue, setAsideAmount);
    let string = `${label}: -$${setAsideAmount}`;
    if(!(isPercentCalculation)) displayCalcResults(value[0], value[1], string, i);
    else {
        setAsideAmount = (netPay * (inputData.value / 100)).toFixed(2);
        string = `${label} ${inputData.value}%: -$${setAsideAmount}`;
        value = calculateNewNetPay(netPay, netPayValue, setAsideAmount);
        displayCalcResults(value[0], value[1], string, i);
    }
}

function calculateNewNetPay(netPay, netPayValue, setAsideAmount) {
    const newNetPay = (netPay - setAsideAmount).toFixed(2);
    const percentageSaved = ((newNetPay / netPayValue) * 100).toFixed(0);
    const arr = [newNetPay, percentageSaved];
    return arr;
}
    
function displayCalcResults(newNetPay, percentageSaved, string, i) {
    getNodeFrom(calcResults, i).textContent = string;
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
    const newLabel = document.createElement('label');
    const newInput = document.createElement('input');
    const newSpan = document.createElement('span');
    const newCalcPercentBtn = document.createElement('button');
    const newCalcFixedNumBtn = document.createElement('button');
    const newResultElement = document.createElement('p');
    const newText = document.createTextNode(label);
    const percentage = document.createTextNode('%');
    const fixedNum = document.createTextNode('#');
    
    newInput.setAttribute('type', 'number');
    newInput.setAttribute('placeholder', '%');
    newInput.setAttribute('id', text[3]);
    newResultElement.setAttribute('class', text[4]);
    newCalcPercentBtn.setAttribute('class', 'test');
    newCalcPercentBtn.setAttribute('id', `calc-percent-btn-${counter}`);
    newCalcFixedNumBtn.setAttribute('class', 'test btn');
    newCalcFixedNumBtn.setAttribute('id', `calc-fixedNum-btn-${counter}`);
    
    mainContainer.appendChild(setAsideDiv);
    setAsideDiv.appendChild(newLabel);
    newLabel.appendChild(newText);
    setAsideDiv.appendChild(newInput);
    setAsideDiv.appendChild(newSpan);
    newSpan.appendChild(newCalcPercentBtn);
    newSpan.appendChild(newCalcFixedNumBtn);
    newCalcPercentBtn.appendChild(percentage);
    newCalcFixedNumBtn.appendChild(fixedNum);
    const reverse = counter - 1;
    
    resultContainer.insertBefore(newResultElement, resultContainer.children[counter]);
    calcResults.insertAtIndex(reverse, newResultElement);
    setAsideMsg.insertAtIndex(reverse, `${label} Set Aside`);
    inputOptions.insertAtIndex(reverse, newInput.value);
    percentCalc.insertAtIndex(reverse, newCalcPercentBtn);
    fixedNumCalc.insertAtIndex(reverse, newCalcFixedNumBtn);
    listenForCalcOption();
    
    numberOfSetAside++;
    counter++;
}

function listenForCalcOption() {
    for(let i = 0; i < percentCalc.length; i++) {
        clacOption.forEach(element => {
            element.getIndex(i).value.addEventListener('click', (e) => {
                if(e.target.id.substring(5, 12) === 'percent') {
                    e.target.autofocus = true;
                    e.target.nextElementSibling.autofocus = false;
                }
                else if(parseInt(e.target.id.substring(18)) > 2) {
                    e.target.autofocus = true;
                    e.target.previousSibling.autofocus = false;
                }
                else {
                    e.target.autofocus = true;
                    e.target.nextSibling.parentElement.childNodes[1].autofocus = false;
                }
            })
        })
    }
}
const getNodeFrom = (list, index) => { return list.getIndex(index).value; }
function getNewSetAside() { return mainContainer.children[counter - 1].children[1] }
function getInputDivs() { return mainContainer.getElementsByTagName('div'); }
function hasNetIncome() {
    if(netIncome.value === empty) { alert(text[2]); return false; }
    else return true;
}