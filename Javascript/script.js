import {createElements, netIncome, resultContainer, inputOptions, calcResults, setAsideMsg, empty, text, setAttributes, appendNodes, displayLoggedSetAsides, getCalcResults, addToList, getNodeFrom, hasNetIncome, limitNotReached, calcOption, removeChar, removeFromList} from './ExtraTools.js';
let percentKeptResults = document.getElementById('total-percentage-kept-results');
let netPayResults = document.getElementById('netpay-aside-results');
const calcOptions = document.querySelectorAll('[data-calc-option]');
const setAsides = document.querySelectorAll('[data-setAside]');
const setAsideBtn = document.getElementById('set-aside-btn');
const collapseBody = document.querySelectorAll('disabled-collapse');
const results = document.querySelectorAll('[data-results]');
export let logContainer = document.getElementById('log-container');
const logResultsBtn = document.getElementById('log-btn');
const clearBtn = document.getElementById('clear-btn');
export const logs = await (await fetch('/setAside')).json();
setAsideMsg.insertAtHead('Bills Set Aside');
setAsideMsg.insertAtHead('Save Set Aside');
export let numberOfSetAside = 1;
export let counter = 3;
displayLoggedSetAsides();

for(let i = 1; i >= 0; i--) {
    inputOptions.insertAtIndex(0, setAsides[i]);
    calcOption.insertAtIndex(0, calcOptions[i]);
    calcResults.insertAtIndex(0, results[i]);
}

export function s(container) {
    logs.forEach(setAside => {
        const div = document.createElement('div');
        const element = document.createElement('p');
        container.append(div);
        div.append(element);
        element.append(setAside.Date + '   ');
        element.append(setAside.Netpay + '   ');
        setAside.SetAsides.forEach(recordValue => {
            div.setAttribute('class', 'log-dropDown');
            element.append(recordValue.SetAside_Name + '   ');
            element.append(recordValue.SetAside_Percentage + '   ');
            element.append(recordValue.Percentage_Amount)
        })
        // console.log(setAside)
        element.append(setAside.Spending_Money + ' ');
        element.append(setAside.Total_Percentage_Kept);
    })
}

s(logContainer);


listenForCalcOption(0, 2);
listenForUserInput(0, 2);

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

logResultsBtn.addEventListener('click', async () => {
    const index4 = netPayResults.textContent.indexOf('$');
    const index3 = percentKeptResults.textContent.indexOf('p');
    const index5 = percentKeptResults.textContent.indexOf('of');
    const leftOver = netPayResults.textContent.substring(index4);
    const kept = percentKeptResults.textContent.substring(index3 + 2, index5 - 1);
    const arr = getSetAsides();
    if(!(arr.length == 0)) {
        const response = (await fetch('/setAside', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            Netpay: netIncome.value,
            SetAsides: arr,
            Spending_Money: leftOver,
            Percentage_Kept: kept })})).json();
        location.reload();
    }
})

function getSetAsides() {
    const setAsides = [];
    for(let i = 0; i < calcResults.length; i++) {
        const object = getCalcResults(i);
        if(!(object === null)) setAsides.push(object);
    }
    return setAsides;
}

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
    const iscalcOptionulation = calcOption.getIndex(i).value.textContent;
    let setAsideAmount = (inputData.value);
    let value = calculateNewNetPay(netPay, netPayValue, setAsideAmount);
    let string = `${label}: -$${setAsideAmount}`;
    if(!(iscalcOptionulation === '%')) displayCalcResults(value[0], value[1], string, i);
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
    return arr;
}

function displayCalcResults(newNetPay, percentageSaved, string, i) {
    getNodeFrom(calcResults, i).textContent = string;
    netPayResults.textContent = `Spending Money: $${newNetPay}`;
    percentKeptResults.textContent = `You Keep ${percentageSaved}% of Your Net Pay!`;
}

function addSetAside(label) {
    if(label === null || label === empty) return;
    const node = createElements();
    setAttributes(node[0], node[2], node[4], node[5], node[6]);
    appendNodes(node[0], node[1], node[2], node[3], node[4], node[5], node[7], node[8], label);
    addToList(node[2], node[4], node[6], label);
    listenForDeleteSetAside(node[5]);
    listenForCalcOption(2, calcOption.length);
    listenForUserInput(2, inputOptions.length);
    counter++;
    numberOfSetAside++;
}

function listenForDeleteSetAside(deleteBtn) {
    deleteBtn.addEventListener('click', (e) => {
        for(let i = 0; i < resultContainer.children.length; i++) {
            if(resultContainer.children[i].id === e.target.id) {
                e.target.parentElement.remove();
                e.target.remove();
                removeFromList(i);
                listenForCalcOption(2, calcOption.length);
                validateSetAsides();
                numberOfSetAside--;
                counter--;
            }
        }
    });
}

function listenForUserInput(start, end) {
    for(let i = start; i < end; i++) {
        inputOptions.getIndex(i).value.addEventListener('input', (e) => { validateSetAsides(); })
    }
}

function listenForCalcOption(start, end) {
    for(let i = start; i < end; i++) {
        calcOption.getIndex(i).value.addEventListener('click', (e) => {
            if(!(e.target.textContent === '#')) {
                e.target.textContent = '#';
                validateSetAsides();
            }
            else { e.target.textContent = '%'; validateSetAsides(); }
        })
    }
}