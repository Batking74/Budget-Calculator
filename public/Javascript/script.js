import * as tools1 from './ExtraTools1.js';
// import * as tools2 from './Extra_Tools_2.js';
let percentKeptResults = document.getElementById('total-percentage-kept-results');
const collapseBody = document.querySelectorAll('disabled-collapse');
let netPayResults = document.getElementById('netpay-aside-results');
const calcOptions = document.querySelectorAll('[data-calc-option]');
const setAsides = document.querySelectorAll('[data-setAside]');
const results = document.querySelectorAll('[data-results]');
const hamburgerMenu = document.querySelector('.menu');
const navbar = document.querySelector('.nav-container');
const logEmptyMsg = document.querySelector('.empty-log-container-msg');
const logResultsBtn = document.getElementById('log-btn');
tools1.setAsideMsg.insertAtHead('Bills Set Aside');
tools1.setAsideMsg.insertAtHead('Save Set Aside');
export let logContainer = document.getElementById('log-container');
export const logs = await (await fetch('/setAside')).json();
export let numberOfSetAside = 1;
export let counter = 3;
const msg = tools1.text[6];
const num = (msg.length) + 2;
let netpays = [];
let i = 0;


// Displaying All Record Log SetAsides in Database
export function displayAllLogs(container) {
    let i = 0, j = 0;
    while(i < logs.length) {
        if(i < logs.length && j == 0) {
            // Create HTML Elements
            let [logDiv,,,,deleteBtn,,date,netpay,spending,tst,,percentKept,reslog] = tools1.getElements();
            container.children[0].insertAdjacentElement('afterend', logDiv);
            // Seting Element Attributes
            logDiv.setAttribute('class', 'log-dropDown');
            deleteBtn.setAttribute('class', 'delete-log-btn');
            deleteBtn.setAttribute('id', logs[i].id);
            // Append Elements to log Container
            appendLogElementsToContainer(logDiv, date, netpay, tst, reslog, deleteBtn);
            // Append SetAide Info to Elements
            appendSetAsideInfoToElements(i, date, netpay, reslog, spending, percentKept, deleteBtn);
        }
        
        if(j < logs[i].SetAsides.length) {
            const ele = document.createElement('p');
            const path = logs[i].SetAsides[j];
            ele.append(`${path.SetAside_Name}: `);
            ele.append(`${path.Calculation_Amount} `);
            if(path.Calculation_Type === '#') {
                ele.append(` of ${(path.SetAside_Netpay).toLocaleString()}`);
            }
            else {
                ele.append(`(${path.Calculation_Type} of ${(path.SetAside_Netpay).toLocaleString()})`);
            }
            container.children[1].children[2].append(ele);
            j++;
            continue;
        }
        j = 0;
        i++;
    }
}

// Appends Elements to log Container
function appendLogElementsToContainer(logDiv, ...elements) {
    logDiv.append(elements[0]);
    logDiv.append(elements[1]);
    logDiv.append(elements[2]);
    logDiv.append(elements[3]);
    logDiv.append(elements[4]);
}

// Appends SetAside Info Elements in each log Container
function appendSetAsideInfoToElements(i, ...elements) {
    elements[0].append(`${logs[i].Date}`);
    elements[1].append(`Net Pay: ${logs[i].Netpay}`);
    elements[2].append(elements[3]);
    elements[2].append(elements[4]);
    elements[3].append(`Spending Money: ${logs[i].Spending_Money} `);
    elements[4].append(`Percentage of Netpay kept: ${logs[i].Total_Percentage_Kept}`);
    elements[5].append(`Delete`);
}

if(logs.length != 0) {
    logEmptyMsg.textContent = '';
    displayAllLogs(logContainer);
}

// Filling in Linked lists with elements
for(let i = 1; i >= 0; i--) {
    tools1.inputOptions.insertAtIndex(0, setAsides[i]);
    tools1.calcOption.insertAtIndex(0, calcOptions[i]);
    tools1.calcResults.insertAtIndex(0, results[i]);
}

// Activating EventListeners
listenForCalcOption(0, 2);
listenForUserInput(0, 2);

// When you click on "Add SetAside" it will validate then add a new SetAside
document.getElementById('set-aside-btn').addEventListener('click', () => {
    if(tools1.hasNetIncome() && tools1.limitNotReached()) addSetAside(prompt(tools1.text[1]));
});

// When you click on a "Delete" Button in the SetAside Log Section it will delete the specified SetAside
document.querySelectorAll('.delete-log-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        if(confirm(tools1.text[7])) {
            const res = (await (await fetch(`/setAside/${e.target.id}`, {
                method: 'DELETE',
                headers: { 'Content-type': 'application/json' }
            })).json())
            e.target.parentElement.remove()
        }
    })
})

document.addEventListener('keyup', (key) => { if(key.key === 'Enter') validateSetAsides() });

// onClick Clear all input in SetAsides
document.getElementById('clear-btn').addEventListener('click', () => {
    for(let i = 0; i < tools1.inputOptions.length; i++) {
        tools1.netIncome.value = tools1.empty;
        tools1.inputOptions.getIndex(i).value.value = tools1.empty;
    }
})

// Sends a POST request to create a new SetAside Record in SQL Database
logResultsBtn.addEventListener('click', async () => {
    const finalResults = getFinalNetPay();
    const arr = getSetAsides();
    if(!(arr.length == 0)) {
        const response = (await fetch('/setAside', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Netpay: `$${parseFloat(tools1.netIncome.value).toLocaleString()}`,
                SetAsides: arr,
                Spending_Money: finalResults[0],
                Percentage_Kept: finalResults[1] })})).json();
                location.reload();
            }
        }
    )

// Retreiving output results in the result/output section
function getFinalNetPay() {
    const index4 = netPayResults.textContent.indexOf('$');
    const index3 = percentKeptResults.textContent.indexOf('p');
    const index5 = percentKeptResults.textContent.indexOf('of');
    const spending$ = netPayResults.textContent.substring(index4);
    const $kept = percentKeptResults.textContent.substring(index3 + 2, index5 - 1);
    return [spending$, $kept];
}

// Returns all new SetAside data before creating a record in SQL Database
function getSetAsides() {
    const setAsides = [];
    for(let i = 0; i < tools1.calcResults.length; i++) {
        const object = tools1.getCalcResults(i, netpays);
        if(!(object === null)) setAsides.push(object);
    } return setAsides;
}


// This function makes sure the user has a Netpay before calculating
function validateSetAsides() {
    netpays.length = tools1.inputOptions.length + 1;
    if(tools1.hasNetIncome()) {
        const msg = tools1.text[6];
        const num = (msg.length) + 2;
        netPayResults.textContent = `${msg}: $${tools1.netIncome.value}`;
        for(let i = 0; i < tools1.inputOptions.length; i++) {
            const label = tools1.getNodeFrom(tools1.setAsideMsg, i);
            let inputData = tools1.getNodeFrom(tools1.inputOptions, i);
            if(inputData.value === tools1.empty) tools1.getNodeFrom(tools1.calcResults, i).textContent = tools1.empty;
            else calculate(tools1.netIncome.value, inputData, label, num, i);
        }
    }
}

// This function calculates all new setAsides, and their setAside preference
function calculate(netPayValue, inputData, label, num, i) {
    const netPay = parseFloat(tools1.removeChar(netPayResults.textContent.substring(num)));
    netpays[i] = netPay;
    const calcOptionSysmbol = tools1.calcOption.getIndex(i).value.textContent;
    let setAsideAmount = (inputData.value);
    let value = calculateNewNetPay(netPay, netPayValue, setAsideAmount);
    let string = `${label}: -$${parseFloat(setAsideAmount).toLocaleString()}`;
    if(!(calcOptionSysmbol === '%')) displayCalcResults(value[0], value[1], string, i);
    else {
        setAsideAmount = (netPay * (inputData.value / 100)).toFixed(2);
        string = `${label} ${inputData.value}%: -$${parseFloat(setAsideAmount).toLocaleString()}`;
        value = calculateNewNetPay(netPay, netPayValue, setAsideAmount);
        displayCalcResults(value[0], value[1], string, i);
    }
}

// Calculates and returns the new Netpay and new overall percentage of netpay kept
function calculateNewNetPay(netPay, netPayValue, setAsideAmount) {
    const newNetPay = parseFloat((netPay - setAsideAmount).toFixed(2));
    const percentageSaved = ((newNetPay / netPayValue) * 100).toFixed(0);
    const arr = [(newNetPay).toLocaleString(), percentageSaved];
    return arr;
}

// This function displays all new calculations to the output/results section
function displayCalcResults(newNetPay, percentageSaved, string, i) {
    tools1.getNodeFrom(tools1.calcResults, i).textContent = string;
    netPayResults.textContent = `Spending Money: $${newNetPay}`;
    percentKeptResults.textContent = `You Keep ${percentageSaved}% of Your Net Pay!`;
}

// This function creates a new SetAside Specified by user
function addSetAside(label) {
    if(label === null || label === tools1.empty) return;
    const newElement = tools1.getElements();
    const node = tools1.setAttributes(newElement[0], newElement[2], newElement[4], newElement[5], newElement[6]);
    tools1.appendNodes(node[0], newElement[1], node[1], newElement[3], node[2], node[3], label);
    tools1.addToList(node[1], node[2], node[4], label);
    listenForDeleteSetAside(node[3]);
    listenForCalcOption(2, tools1.calcOption.length);
    listenForUserInput(2, tools1.inputOptions.length);
    counter++;
    numberOfSetAside++;
}

// Delete setaside buttons eventlisteners
function listenForDeleteSetAside(deleteBtn) {
    deleteBtn.addEventListener('click', (e) => {
        for(let i = 0; i < tools1.resultContainer.children.length; i++) {
            if(tools1.resultContainer.children[i].id === e.target.id) {
                e.target.parentElement.remove();
                e.target.remove();
                tools1.removeFromList(i);
                listenForCalcOption(2, tools1.calcOption.length);
                validateSetAsides();
                numberOfSetAside--;
                counter--;
            }
        }
    });
}

// Listeners for user input in SetAside Inputs
function listenForUserInput(start, end) {
    tools1.netIncome.setAttribute('onkeypress', 'if(this.value.length==10) return false;')
    for(let i = start; i < end; i++) {
        tools1.inputOptions.getIndex(i).value.setAttribute('onkeypress', 'if(this.value.length==8) return false;');
        tools1.inputOptions.getIndex(i).value.addEventListener('input', (e) => { validateSetAsides(); })
    }
}

// Listeners for user calculation preference change
function listenForCalcOption(start, end) {
    for(let i = start; i < end; i++) {
        tools1.calcOption.getIndex(i).value.addEventListener('click', (e) => {
            const isForNewSetAside = counter - 1 < end + 1;
            if(isForNewSetAside) changeCalcOption(e);
            if(!(isForNewSetAside) && i < 2) changeCalcOption(e);
        }
    )}
}

// Algorithm for changing the users calulation preference (calcOption)
function changeCalcOption(e) {
    const isfixedNumCalculation = !(e.target.textContent === '#');
    if(isfixedNumCalculation) { e.target.textContent = '#'; validateSetAsides(); }
    else { e.target.textContent = '%'; validateSetAsides(); }
}

// Binary Search Algorithm (Better time complexity when searching O(Log n))
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