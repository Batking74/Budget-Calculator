import * as tools from './ExtraTools.js';
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
tools.setAsideMsg.insertAtHead('Bills Set Aside');
tools.setAsideMsg.insertAtHead('Save Set Aside');
let netpays = [];
export let numberOfSetAside = 1;
export let counter = 3;
// displayLoggedSetAsides();

for(let i = 1; i >= 0; i--) {
    tools.inputOptions.insertAtIndex(0, setAsides[i]);
    tools.calcOption.insertAtIndex(0, calcOptions[i]);
    tools.calcResults.insertAtIndex(0, results[i]);
}

export function displayAllLogs(container) {
    logs.forEach(setAside => {
        const element = tools.getElement();
        element[0].setAttribute('class', 'log-dropDown');
        element[4].setAttribute('class', 'delete-log-btn');
        container.children[0].insertAdjacentElement('afterend', element[0])
        element[0].append(element[6]);
        element[0].append(element[7]);
        element[0].append(element[9]);
        element[0].append(element[12]);
        element[12].append(element[8]);
        element[12].append(element[11]);
        element[0].append(element[4]);
        element[6].append(`${setAside.Date}`);
        element[7].append(`Net Pay: ${setAside.Netpay}`);
        for(let i = 0; i < setAside.SetAsides.length; i++) {
            const ele = document.createElement('p');
            const path = setAside.SetAsides[i];
            ele.append(`${path.SetAside_Name}: `);
            ele.append(`${path.Percentage_Amount} `);
            ele.append(`(${path.SetAside_Percentage} of $${path.SetAside_Netpay})`);
            element[9].append(ele);
        }
        element[8].append(`Spending Money: ${setAside.Spending_Money} `);
        element[11].append(`Percentage of Netpay kept: ${setAside.Total_Percentage_Kept}`);
        element[4].append(`Delete`);
    })
}

displayAllLogs(logContainer);
listenForCalcOption(0, 2);
listenForUserInput(0, 2);

setAsideBtn.addEventListener('click', () => {
    if(tools.hasNetIncome() && tools.limitNotReached()) addSetAside(prompt(tools.text[1]));
});
document.addEventListener('keyup', (key) => { if(key.key === 'Enter') validateSetAsides() });
clearBtn.addEventListener('click', () => {
    for(let i = 0; i < tools.inputOptions.length; i++) {
        tools.netIncome.value = tools.empty;
        tools.inputOptions.getIndex(i).value.value = tools.empty;
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
                Netpay: `$${tools.netIncome.value}`,
                SetAsides: arr,
                Spending_Money: leftOver,
                Percentage_Kept: kept })})).json();
                location.reload();
            }
        })
        
        
        function getSetAsides() {
            const setAsides = [];
            for(let i = 0; i < tools.calcResults.length; i++) {
                const object = tools.getCalcResults(i, netpays);
                if(!(object === null)) setAsides.push(object);
            } return setAsides;
}

function validateSetAsides() {
    netpays.length = tools.inputOptions.length + 1;
    if(tools.hasNetIncome()) {
        const msg = 'Spending Money';
        const num = (msg.length) + 2;
        netPayResults.textContent = `${msg}: $${tools.netIncome.value}`;
        for(let i = 0; i < tools.inputOptions.length; i++) {
            const label = tools.getNodeFrom(tools.setAsideMsg, i);
            let inputData = tools.getNodeFrom(tools.inputOptions, i);
            if(inputData.value === tools.empty) tools.getNodeFrom(tools.calcResults, i).textContent = tools.empty;
            else calculate(tools.netIncome.value, inputData, label, num, i);
        }
    }
}

function calculate(netPayValue, inputData, label, num, i) {
    const netPay = parseFloat(tools.removeChar(netPayResults.textContent.substring(num)));
    netpays[i] = netPay;
    const iscalcOptionulation = tools.calcOption.getIndex(i).value.textContent;
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
    tools.getNodeFrom(tools.calcResults, i).textContent = string;
    netPayResults.textContent = `Spending Money: $${newNetPay}`;
    percentKeptResults.textContent = `You Keep ${percentageSaved}% of Your Net Pay!`;
}

function addSetAside(label) {
    if(label === null || label === tools.empty) return;
    const newElement = tools.getElement();
    const node = tools.setAttributes(newElement[0], newElement[2], newElement[4], newElement[5], newElement[6]);
    tools.appendNodes(node[0], newElement[1], node[1], newElement[3], node[2], node[3], label);
    tools.addToList(node[1], node[2], node[4], label);
    listenForDeleteSetAside(node[3]);
    listenForCalcOption(2, tools.calcOption.length);
    listenForUserInput(2, tools.inputOptions.length);
    counter++;
    numberOfSetAside++;
}

function listenForDeleteSetAside(deleteBtn) {
    deleteBtn.addEventListener('click', (e) => {
        for(let i = 0; i < tools.resultContainer.children.length; i++) {
            if(tools.resultContainer.children[i].id === e.target.id) {
                e.target.parentElement.remove();
                e.target.remove();
                tools.removeFromList(i);
                listenForCalcOption(2, tools.calcOption.length);
                validateSetAsides();
                numberOfSetAside--;
                counter--;
            }
        }
    });
}

function listenForUserInput(start, end) {
    for(let i = start; i < end; i++) {
        tools.inputOptions.getIndex(i).value.setAttribute('onkeypress', 'if(this.value.length==8) return false;');
        tools.inputOptions.getIndex(i).value.addEventListener('input', (e) => { validateSetAsides(); })
    }
}

function listenForCalcOption(start, end) {
    for(let i = start; i < end; i++) {
        tools.calcOption.getIndex(i).value.addEventListener('click', (e) => {
            const isForNewSetAside = counter - 1 < end + 1;
            if(isForNewSetAside) changeCalcOption(e);
            if(!(isForNewSetAside) && i < 2) changeCalcOption(e);
        }
    )}
}

function changeCalcOption(e) {
    const isfixedNumCalculation = !(e.target.textContent === '#');
    if(isfixedNumCalculation) { e.target.textContent = '#'; validateSetAsides(); }
    else { e.target.textContent = '%'; validateSetAsides(); }
}

function binarySearch(array, target) {
    let start = 0;
    let end = array.length - 1;

    while(start <= end) {
        let middlePosition = Math.floor((start + end) / 2);
        let middleNumber = array[middlePosition];
        if(middleNumber == target) return middleNumber - 1;
        if(target < middleNumber) end = middlePosition - 1;
        else start = middlePosition + 1;
    }
    return -1;
}