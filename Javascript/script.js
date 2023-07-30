import {mainContainer, netIncome, resultContainer, inputOptions, calcResults, setAsideMsg, percentCalc, fixedNumCalc, empty, text, setAttributes, appendNodes, insertNodes, getNodeFrom, getNewSetAside, getInputDivs, hasNetIncome, removeChar} from '../Javascript/functions.js';

const saveOption = document.getElementById('save-option');
const billsOption = document.getElementById('bills-option');
const calcBtn = document.getElementById('btn');
const setAsideBtn = document.getElementById('set-aside-btn');
const clearBtn = document.getElementById('clear-btn');
const calcPercentageBtn1 = document.getElementById('calc-percent-btn-1');
const calcFixedNumBtn1 = document.getElementById('calc-fixedNum-btn-1');
const calcPercentageBtn2 = document.getElementById('calc-percent-btn-2');
const calcFixedNumBtn2 = document.getElementById('calc-fixedNum-btn-2');
const saveResults = document.getElementById('save-aside-results');
const billsResults = document.getElementById('bill-saide-results');
let netPayResults = document.getElementById('netpay-aside-results');
let percentKeptResults = document.getElementById('total-percentage-kept-results');

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

let numberOfSetAside = 0;
export let counter = 3;
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

function addSetAside(label) {
    if(label === null || label === empty) return;
    const setAsideDiv = document.createElement('div');
    const newInput = document.createElement('input');
    const newCalcPercentBtn = document.createElement('button');
    const newCalcFixedNumBtn = document.createElement('button');
    const newResultElement = document.createElement('p');
    setAttributes(newInput, newResultElement, newCalcPercentBtn, newCalcFixedNumBtn);
    appendNodes(newInput, setAsideDiv, newCalcPercentBtn, newCalcFixedNumBtn, label);
    insertNodes(newInput, newResultElement, newCalcPercentBtn, newCalcFixedNumBtn, label);
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