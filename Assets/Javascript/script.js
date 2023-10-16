import * as tools1 from './ExtraTools.js';
import * as tools2 from './Extra_Tools_2.js';
let percentKeptResults = document.getElementById('total-percentage-kept-results');
let netPayResults = document.getElementById('netpay-aside-results');
const calcOptions = document.querySelectorAll('[data-calc-option]');
const setAsides = document.querySelectorAll('[data-setAside]');
const results = document.querySelectorAll('[data-results]');
const hamburgerMenu = document.querySelector('.menu');
const navbar = document.querySelector('.nav-container');
const logEmptyMsg = document.querySelector('.empty-log-container-msg');
export let logContainer = document.getElementById('log-container');
const logResultsBtn = document.getElementById('log-btn');
tools1.setAsideMsg.insertAtHead('Bills Set Aside');
tools1.setAsideMsg.insertAtHead('Save Set Aside');
export let numberOfSetAside = 1;
export let counter = 3;
const msg = tools1.text[6];
const num = (msg.length) + 2;
let netpays = [];
let i = 0;

// Recursive function that displays all setasides in Localstorage
function displayLoggedSetAsides(i) {

    // Base Case
    if(localStorage.length <= i && !(localStorage.length >= 20)) {
        console.log('Log Successfuly Loaded!');
        return;
    }

    // Recursive Case
    let key = localStorage.key(i);
    let setAside = localStorage.getItem(key);
    let log = JSON.parse(setAside);
    let element = tools1.getElement();
    logContainer.children[0].insertAdjacentElement('afterend', element[0]);
    logEmptyMsg.style.display = 'none';
    logContainer.style.height = 'fit-content';
    element[0].setAttribute('class', 'log-dropDown');
    tools2.appendElements(element);
    tools2.displayElements(element, log, key);
    displayLoggedSetAsides(i + 1);
}

displayLoggedSetAsides(0);

// Setting Eventlisteners
document.getElementById('set-aside-btn').addEventListener('click', addSetAside);
document.addEventListener('keyup', (key) => { if(key.key === 'Enter') validateSetAsides() });
document.getElementById('clear-btn').addEventListener('click', clearInputs);
document.querySelectorAll('.delete-log-btn').forEach(deleteSetAsideLog);
tools1.netIncome.addEventListener('input', validateNetIncome);
logResultsBtn.addEventListener('click', createNewLogRecord);
hamburgerMenu.addEventListener('click', () => {navbar.classList.toggle('active')});

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
function addSetAside() {
    if(tools1.hasNetIncome() && tools1.limitNotReached()) createSetAside(prompt(tools1.text[1]));
}


// When you click on a "Delete" Button in the SetAside Log Section it will delete the specified SetAside
function deleteSetAsideLog(btn) {
    btn.addEventListener('click', (e) => {
        if(confirm(tools1.text[7])) {
            localStorage.removeItem(e.target.id);
            e.target.parentElement.remove();
            if(localStorage.length == 0) {
                logEmptyMsg.style.display = 'block';
                logContainer.style.height = '200px';
            }
        }
    })
}


// Clears all SetAside input feilds
function clearInputs() {
    for(let i = 0; i < tools1.inputOptions.length; i++) {
        tools1.netIncome.value = '';
        tools1.inputOptions.getIndex(i).value.value = '';
    }
}


// Creates a new SetAside Record in Localstorage
function createNewLogRecord() {
    const finalResults = tools2.getFinalNetPay(netPayResults, percentKeptResults);
    const arr = tools2.getSetAsides(netpays);
    if(!(arr.length == 0)) {
        localStorage.setItem(parseInt(Math.random() * 9999999), JSON.stringify({
            Log: {
                Date: getDate(),
                Netpay: `$${tools1.netIncome.value}`,
                SetAsides: arr,
                Spending_Money: finalResults[0],
                Percentage_Kept: finalResults[1]
            }
        }
        ));
        location.reload();
    }
}


// This function makes sure the user has a Netpay before calculating
function validateSetAsides() {
    netpays.length = tools1.inputOptions.length + 1;
    if(tools1.hasNetIncome()) {
        const netPay = tools1.removeChar(tools1.netIncome.value);
        netPayResults.textContent = `${msg}: $${netPay.toLocaleString()}`;
        for(let i = 0; i < tools1.inputOptions.length; i++) {
            const label = tools1.getNodeFrom(tools1.setAsideMsg, i);
            let inputData = tools1.getNodeFrom(tools1.inputOptions, i);
            if(inputData.value === '') tools1.getNodeFrom(tools1.calcResults, i).textContent = '';
            else calculate(netPay, inputData, label, i);
        }
    }
}


// This function calculates all new setAsides, and their setAside preference (% or #)
function calculate(netPayValue, inputData, label, i) {

    // Collects all netpays
    netpays[i] = netPayValue;
    
    const calcOptionSysmbol = tools1.calcOption.getIndex(i).value.textContent;
    let setAsideAmount = (inputData.value);
    let value = calculateNewNetPay(netPayValue, setAsideAmount);
    let string = `${label}: -$${parseFloat(setAsideAmount).toLocaleString()}`;
    // console.log(netPayValue)
    if(!(calcOptionSysmbol === '%')) displayCalcResults(value[0], value[1], string, i);
    else {
        setAsideAmount = (netPayValue * (inputData.value / 100)).toFixed(2);
        string = `${label} ${inputData.value}%: -$${parseFloat(setAsideAmount).toLocaleString()}`;
        value = calculateNewNetPay(netPayValue, setAsideAmount);
        displayCalcResults(value[0], value[1], string, i);
    }
}


// Calculates and returns the new Netpay and new overall percentage of netpay kept
function calculateNewNetPay(netPayValue, setAsideAmount) {
    let arr;
    const newNetPay = parseFloat((netPayValue - setAsideAmount).toFixed(2));
    const percentageSaved = ((newNetPay / netPayValue) * 100).toFixed(0);
    if(newNetPay <= 0) arr = [0, 0];
    else arr = [(newNetPay).toLocaleString(), percentageSaved];
    return arr;
}


// This function displays all new calculations to the output/results section
function displayCalcResults(newNetPay, percentageSaved, string, i) {
    tools1.getNodeFrom(tools1.calcResults, i).textContent = string;
    netPayResults.textContent = `Spending Money: $${newNetPay}`;
    percentKeptResults.textContent = `You Keep ${percentageSaved}% of Your Net Pay!`;
}


// This function creates a new SetAside Specified by user
function createSetAside(label) {
    if(label === null || label === '') return;
    const newElement = tools1.getElement();
    const node = tools1.setAttributes(newElement[0], newElement[2], newElement[4], newElement[5], newElement[6]);
    tools1.appendNodes(node[0], newElement[1], node[1], newElement[3], node[2], node[3], label);
    tools1.addToList(node[1], node[2], node[4], label);
    listenForDeleteSetAside(node[3]);
    listenForCalcOption(2, tools1.calcOption.length);
    listenForUserInput(2, tools1.inputOptions.length);
    counter++;
    numberOfSetAside++;
}


// Calculates when user inputs a new netIncome under 1 condition.
function validateNetIncome(e) {
    const newNetPay = tools1.removeChar(netPayResults.textContent.substring(num));
    if(newNetPay >= 0) validateSetAsides();
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
    tools1.netIncome.setAttribute('onkeypress', 'if(this.value.length==8) return false;')
    for(let i = start; i < end; i++) {
        tools1.inputOptions.getIndex(i).value.setAttribute('onkeypress', 'if(this.value.length==7) return false;');
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
    if(isfixedNumCalculation) {
        change(e, '#', '36.1px');
    }
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


function binarySearch(list, target) {
    let left = 0;
    let right = list.length - 1;

    while(left <= right) {
        // find the middle index
        let middle = Math.floor((left + right) / 2);
        const value = parseInt(list.getIndex(middle).value.id);

        //check if the middle element is the target
        if(value == target) {

            // Target found return its index
            return middle;
        }
        else if(value < target) {

            // if the target is greater ignore the left half
            left = middle + 1;
        }
        else {

            // if the target is smaller ignore the right half
            right = middle - 1;
        }
    }

    return 0;
}