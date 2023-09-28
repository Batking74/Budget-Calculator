import * as tools from './ExtraTools.js';
let percentKeptResults = document.getElementById('total-percentage-kept-results');
let netPayResults = document.getElementById('netpay-aside-results');
const calcOptions = document.querySelectorAll('[data-calc-option]');
const setAsides = document.querySelectorAll('[data-setAside]');
const collapseBody = document.querySelectorAll('disabled-collapse');
const results = document.querySelectorAll('[data-results]');
const hamburgerMenu = document.querySelector('.menu');
const navbar = document.querySelector('.nav-container');
export let logContainer = document.getElementById('log-container');
const logResultsBtn = document.getElementById('log-btn');
tools.setAsideMsg.insertAtHead('Bills Set Aside');
tools.setAsideMsg.insertAtHead('Save Set Aside');
export let numberOfSetAside = 1;
export let counter = 3;
const msg = tools.text[6];
const num = (msg.length) + 2;
let netpays = [];
let i = 0;


// Displaying All Record SetAsides from localstorage
while(i < localStorage.length) {
    const key = localStorage.key(i);
    console.log(key)
    const setAside = localStorage.getItem(key);
    const log = JSON.parse(setAside);
    const element = tools.getElement();
    element[0].setAttribute('class', 'log-dropDown');
    logContainer.children[0].insertAdjacentElement('afterend', element[0]);
    appendElements(element);
    displayElements(element, log, key);
    i++;
}


// Appends All log elements to the document
function appendElements(element) {
    element[0].append(element[6]);
    element[0].append(element[7]);
    element[0].append(element[9]);
    element[0].append(element[12]);
    element[12].append(element[8]);
    element[12].append(element[11]);
    element[0].append(element[4]);
}


// Displays All Records of SetAsides in the log Section
function displayElements(element, log, key) {
    
    // Date Element
    element[6].setAttribute('class', 'date-log');
    element[6].append(`${log.Log.Date}`);
    
    // Net Pay Element
    element[7].setAttribute('class', 'netpay-log');
    element[7].append(`Net Pay: ${log.Log.Netpay}`);
    
    // Displaying Each SetAside
    for(let i = 0; i < log.Log.SetAsides.length; i++) {
        const setAsideElement = document.createElement('p');
        const path = log.Log.SetAsides[i];
        setAsideElement.append(`${path.SetAside_Name}: `);
        setAsideElement.append(`${path.Calculation_Amount} `);
        if(path.Calculation_Type === '#') {
            setAsideElement.append(` of ${(path.SetAside_Netpay).toLocaleString()}`);
        }
        else setAsideElement.append(`(${path.Calculation_Type} of ${(path.SetAside_Netpay).toLocaleString()})`);
        //  checkCalcOption(log, ele);
        element[9].setAttribute('class', 'setAside-log-container');
        element[9].append(setAsideElement);
    }
    
    
    // Displaying Spending Money/Percentage Kept Elements
    element[12].setAttribute('class', 'overall-calc-leftovers-container-log');
    element[8].append(`Spending Money: ${log.Log.Spending_Money} `);
    element[11].append(`Percentage of Netpay kept: ${log.Log.Percentage_Kept}`);
    
    // Displaying Delete Btn
    element[4].setAttribute('class', 'delete-log-btn');
    element[4].setAttribute('id', key);
    element[4].append(`Delete`);
}


// Setting Eventlisteners
document.getElementById('set-aside-btn').addEventListener('click', addSetAside);
document.addEventListener('keyup', (key) => { if(key.key === 'Enter') validateSetAsides() });
document.getElementById('clear-btn').addEventListener('click', clearInputs);
document.querySelectorAll('.delete-log-btn').forEach(deleteSetAsideLog);
tools.netIncome.addEventListener('keyup', validateNetIncome);
logResultsBtn.addEventListener('click', createNewLogRecord);
hamburgerMenu.addEventListener('click', () => {navbar.classList.toggle('active')});

// Filling in Linked lists with elements
for(let i = 1; i >= 0; i--) {
    tools.inputOptions.insertAtIndex(0, setAsides[i]);
    tools.calcOption.insertAtIndex(0, calcOptions[i]);
    tools.calcResults.insertAtIndex(0, results[i]);
}


// Activating EventListeners
listenForCalcOption(0, 2);
listenForUserInput(0, 2);



// When you click on "Add SetAside" it will validate then add a new SetAside
function addSetAside() {
    if(tools.hasNetIncome() && tools.limitNotReached()) createSetAside(prompt(tools.text[1]));
}


// When you click on a "Delete" Button in the SetAside Log Section it will delete the specified SetAside
function deleteSetAsideLog(btn) {
    btn.addEventListener('click', (e) => {
        if(confirm(tools.text[7])) {
            localStorage.removeItem(e.target.id)
            e.target.parentElement.remove();
        }
    })
}


// onClick Clear all input in SetAsides
function clearInputs() {
    for(let i = 0; i < tools.inputOptions.length; i++) {
        tools.netIncome.value = tools.empty;
        tools.inputOptions.getIndex(i).value.value = tools.empty;
    }
}


// Creates a new SetAside Record in Localstorage
function createNewLogRecord() {
    const finalResults = getFinalNetPay();
    const arr = getSetAsides();
    if(!(arr.length == 0)) {
        localStorage.setItem(parseInt(Math.random() * 9999999), JSON.stringify({
            Log: {
                Date: getDate(),
                Netpay: `$${parseFloat(tools.netIncome.value).toLocaleString()}`,
                SetAsides: arr,
                Spending_Money: finalResults[0],
                Percentage_Kept: finalResults[1]
            }
        }
        ));
        location.reload();
    }
}


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
    for(let i = 0; i < tools.calcResults.length; i++) {
        const object = tools.getCalcResults(i, netpays);
        if(!(object === null)) setAsides.push(object);
    } return setAsides;
}


// This function makes sure the user has a Netpay before calculating
function validateSetAsides() {
    netpays.length = tools.inputOptions.length + 1;
    if(tools.hasNetIncome()) {
        netPayResults.textContent = `${msg}: $${tools.netIncome.value}`;
        for(let i = 0; i < tools.inputOptions.length; i++) {
            const label = tools.getNodeFrom(tools.setAsideMsg, i);
            let inputData = tools.getNodeFrom(tools.inputOptions, i);
            if(inputData.value === tools.empty) tools.getNodeFrom(tools.calcResults, i).textContent = tools.empty;
            else calculate(tools.netIncome.value, inputData, label, i);
        }
    }
}


// This function calculates all new setAsides, and their setAside preference
function calculate(netPayValue, inputData, label, i) {
    const netPay = parseFloat(tools.removeChar(netPayResults.textContent.substring(num)));
    netpays[i] = netPay;
    const calcOptionSysmbol = tools.calcOption.getIndex(i).value.textContent;
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
    let arr;
    const newNetPay = parseFloat((netPay - setAsideAmount).toFixed(2));
    const percentageSaved = ((newNetPay / netPayValue) * 100).toFixed(0);
    if(newNetPay <= 0) arr = [0, 0];
    else arr = [(newNetPay).toLocaleString(), percentageSaved];
    return arr;
}


// This function displays all new calculations to the output/results section
function displayCalcResults(newNetPay, percentageSaved, string, i) {
    tools.getNodeFrom(tools.calcResults, i).textContent = string;
    netPayResults.textContent = `Spending Money: $${newNetPay}`;
    percentKeptResults.textContent = `You Keep ${percentageSaved}% of Your Net Pay!`;
}


// This function creates a new SetAside Specified by user
function createSetAside(label) {
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


// Calculates when user inputs a new netIncome under 1 condition.
function validateNetIncome() {
    const netPay = parseFloat(tools.removeChar(netPayResults.textContent.substring(num)));
    if((netPay >= 0)) validateSetAsides();
}


// Delete setaside buttons eventlisteners
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


// Listeners for user input in SetAside Inputs
function listenForUserInput(start, end) {
    tools.netIncome.setAttribute('onkeypress', 'if(this.value.length==6) return false;')
    for(let i = start; i < end; i++) {
        tools.inputOptions.getIndex(i).value.setAttribute('onkeypress', 'if(this.value.length==6) return false;');
        tools.inputOptions.getIndex(i).value.addEventListener('input', (e) => { validateSetAsides(); })
    }
}


// Listeners for user calculation preference change
function listenForCalcOption(start, end) {
    for(let i = start; i < end; i++) {
        tools.calcOption.getIndex(i).value.addEventListener('click', (e) => {
            const isForNewSetAside = counter - 1 < end + 1;
            if(isForNewSetAside) changeCalcOption(e);
            if(!(isForNewSetAside) && i < 2) changeCalcOption(e);
        }
    )}
}

// Algorithm for changing the users calulation preference (calcOption)
function changeCalcOption(e) {
    const isfixedNumCalculation = !(e.target.textContent === '#');
    if(isfixedNumCalculation) change(e, '#', '36.1px');
    else change(e, '%', '37px');
}

function change(e, option, width) {
    e.target.style.width = width;
    e.target.textContent = option; validateSetAsides();
}


// Returns the current date and Time
function getDate() {
    const date = new Date();
    return `${date.toUTCString().substring(0, 3)} ${date.toLocaleString()}`;
} setInterval(getDate, 1000);