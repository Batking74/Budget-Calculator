import {mainContainer, createElements, netIncome, resultContainer, inputOptions, calcResults, setAsideMsg, percentCalc, fixedNumCalc, empty, text, setAttributes, appendNodes, addToList, getNodeFrom, getNewSetAside, getInputDivs, hasNetIncome, limitNotReached, removeChar, removeFromList} from './ExtraTools.js';
const setAsides = document.querySelectorAll('[data-setAside]');
const calcPercentageBtns = document.querySelectorAll('[data-calc-percentage]');
const calcWholeNumBtns = document.querySelectorAll('[data-calc-whole-num]');
const logResultsBtn = document.getElementById('log-btn');
const setAsideBtn = document.getElementById('set-aside-btn');
const clearBtn = document.getElementById('clear-btn');
const results = document.querySelectorAll('[data-results]');
let logContainer = document.getElementById('log-container');
let netPayResults = document.getElementById('netpay-aside-results');
let percentKeptResults = document.getElementById('total-percentage-kept-results');
const logs = await (await fetch('/logs')).json();

for(let i = 1; i >= 0; i--) {
    inputOptions.insertAtIndex(0, setAsides[i]);
    percentCalc.insertAtIndex(0, calcPercentageBtns[i]);
    fixedNumCalc.insertAtIndex(0, calcWholeNumBtns[i]);
    calcResults.insertAtIndex(0, results[i]);
}
const calcOptions = [percentCalc, fixedNumCalc];
setAsideMsg.insertAtHead('Bills Set Aside');
setAsideMsg.insertAtHead('Save Set Aside');
export let numberOfSetAside = 1;
export let counter = 3;
listenForCalcOption();
listenForUserInput(0);

setAsideBtn.addEventListener('click', () => {
    if(hasNetIncome() && limitNotReached()) addSetAside(prompt(text[1]));
});
document.addEventListener('keyup', (key) => { if(key.key === 'Enter') validateSetAsides() });
clearBtn.addEventListener('click', () => {
    for(let i = 0; i < inputOptions.length; i++) {
        netIncome.value = empty;
        inputOptions.getIndex(i).value.value = empty;
    }
})
console.log(Object.keys(logs[0].SetAsides)[0])
logResultsBtn.addEventListener('click', () => {
    for(let i = 0; i < logs.length; i++) {
        const element = document.createElement('p');
        element.append(Object.keys(logs[i].SetAsides)[0]);
        logContainer.append(element);
    }
})

function validateSetAsides() {
    if(hasNetIncome()) {
        const msg = 'Spending Money';
        const num = (msg.length) + 2;
        netPayResults.textContent = `${msg}: $${netIncome.value}`;
        for(let i = 0; i < inputOptions.length; i++) {
            const label = getNodeFrom(setAsideMsg, i);
            let inputData = getNodeFrom(inputOptions, i);
            if(inputData.value === empty) getNodeFrom(calcResults, i).textContent = empty;
            else calculate(netIncome.value, inputData, label, num, i);
        }
    }
}

function calculate(netPayValue, inputData, label, num, i) {
    const netPay = parseFloat(removeChar(netPayResults.textContent.substring(num)));
    const isPercentCalculation = percentCalc.getIndex(i).value.dataset.isactive;
    let setAsideAmount = (inputData.value);
    let value = calculateNewNetPay(netPay, netPayValue, setAsideAmount);
    let string = `${label}: -$${setAsideAmount}`;
    if(!(isPercentCalculation === 'true')) displayCalcResults(value[0], value[1], string, i);
    else {
        setAsideAmount = (netPay * (inputData.value / 100)).toFixed(2);
        string = `${label} ${inputData.value}%: -$${setAsideAmount}`;
        value = calculateNewNetPay(netPay, netPayValue, setAsideAmount);
        displayCalcResults(value[0], value[1], string, i);
    }
}

function calculateNewNetPay(netPay, netPayValue, setAsideAmount) {
    const newNetPay = parseInt(netPay - setAsideAmount);
    const percentageSaved = ((newNetPay / netPayValue) * 100).toFixed(0);
    const arr = [newNetPay.toLocaleString(), percentageSaved];
    console.log()
    return arr;
}

function displayCalcResults(newNetPay, percentageSaved, string, i) {
    getNodeFrom(calcResults, i).textContent = string;
    netPayResults.textContent = `Spending Money: $${newNetPay}`;
    percentKeptResults.textContent = `You Keep ${percentageSaved}% of Your Net Pay!`;
}

function addSetAside(label) {
    if(label === null || label === empty) return;
    const element = createElements();
    setAttributes(element[1], element[5], element[2], element[3], element[4], label);
    appendNodes(element[1], element[0], element[2], element[3], label, element[4]);
    addToList(element[1], element[5], element[2], element[3], label);
    listenForDeleteSetAside(element[4], element[2], element[3]);
    listenForCalcOption();
    listenForUserInput(2);
    counter++;
    numberOfSetAside++;
}

function listenForDeleteSetAside(deleteBtn, percentBtn, wholeNumBtn) {
    deleteBtn.addEventListener('click', (e) => {
        const element = e.target.id - 1;
        console.log(resultContainer.childNodes)
        // calcResults.getIndex(element).value.remove()
        calcResults.removeIndex(element);
        setAsideMsg.removeIndex(element);
        inputOptions.removeIndex(element);
        percentCalc.removeIndex(element);
        fixedNumCalc.removeIndex(element);
        e.target.parentElement.remove();
        counter--;
        numberOfSetAside--;
        for(let i = 2; i < fixedNumCalc.length; i++) {
            let decrementIDs1 = fixedNumCalc.getIndex(i).value.dataset;
            let decrementIDs2 = percentCalc.getIndex(i).value.dataset;
            decrementIDs1.calcWholeNum = decrementIDs1.calcWholeNum - 1;
            decrementIDs2.calcWholeNum = decrementIDs2.calcWholeNum - 1;
        }
        validateSetAsides();
    });
}

function listenForUserInput(start) {
    for(let i = start; i < inputOptions.length; i++) {
        inputOptions.getIndex(i).value.addEventListener('input', () => { validateSetAsides(); })
    }
}

function listenForCalcOption() {
    for(let i = 0; i < percentCalc.length; i++) {
        calcOptions.forEach(element => {
            element.getIndex(i).value.addEventListener('click', (e) => {
                if(e.target.dataset.isactive === 'false' && parseInt(e.target.id) == 0) {
                    e.target.dataset.isactive = true;
                    e.target.nextElementSibling.dataset.isactive = false;
                    validateSetAsides();
                }
                else if(e.target.dataset.isactive === 'false' && parseInt(e.target.id) == 1) {
                    e.target.dataset.isactive = true;
                    e.target.previousElementSibling.dataset.isactive = false;
                    validateSetAsides();
                }
            })
        })
    }
}