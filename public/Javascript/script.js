import * as utils1 from './utils1.js';
import * as utils2 from './utils2.js';
import * as utils3 from './utils3.js';

// Targeting Elements
export let percentKeptResults = document.getElementById('total-percentage-kept-results');
export const logEmptyMsg = document.querySelector('.empty-log-container-msg');
export let netPayResults = document.getElementById('netpay-aside-results');
export const calcOptions = document.querySelectorAll('[data-calc-option]');
export const setAsides = document.querySelectorAll('[data-setAside]');
export const results = document.querySelectorAll('[data-results]');
export let logContainer = document.getElementById('log-container');
export const navbar = document.querySelector('.nav-container');
export const hamburgerMenu = document.querySelector('.menu');
export let logs;
export let numberOfSetAside = 1;
export let counter = 3;
export let netpays = [];

try { logs = await (await fetch('/setAside')).json(); }
catch(error) { console.log(error); }

utils1.setAsideMsg.insertAtHead('Bills Set Aside');
utils1.setAsideMsg.insertAtHead('Save Set Aside');

// Displaying All Record Log SetAsides in Database Time Complexity: O(n)
export function displayAllLogs(container) {
    let i = 0, j = 0;
    while(i < logs.length) {
        if(i < logs.length && j == 0) {
            utils2.showLogDetails(container, i);
        }
        if(j < logs[i].SetAsides.length) {
            utils2.showAllSetAsidesInLog(container, i, j);
            j++;
            continue;
        }
        j = 0;
        i++;
    }
}


// Activating EventListeners
utils2.initCalculator();
utils3.listenForCalcOption(0, 2);
utils3.listenForUserInput(0, 2);
utils3.setAllEventListeners();


// This function makes sure the user has a Netpay before calculating
export function validateSetAsides() {
    netpays.length = utils1.inputOptions.length + 1;
    if(utils1.hasNetIncome()) {
        const msg = utils1.text[6];
        const num = (msg.length) + 2;
        netPayResults.textContent = `${msg}: $${utils1.netIncome.value}`;
        for(let i = 0; i < utils1.inputOptions.length; i++) {
            const label = utils1.setAsideMsg.getIndex(i).value;
            let inputData = utils1.inputOptions.getIndex(i).value;
            if(inputData.value === utils1.empty) {
                utils1.calcResults.getIndex(i).textContent = utils1.empty;
            }
            else calculate(utils1.netIncome.value, inputData, label, num, i);
        }
    }
}


// This function calculates all new setAsides, and their setAside preference
function calculate(netPayValue, inputData, label, num, i) {
    const netPay = parseFloat(utils1.removeChar(netPayResults.textContent.substring(num)));
    netpays[i] = netPay;
    // Default Calculation: #
    const calcOptionSysmbol = utils1.calcOption.getIndex(i).value.textContent;
    let setAsideAmount = (inputData.value);
    let value = calculateNewNetPay(netPay, netPayValue, setAsideAmount);
    let string = `${label}: -$${parseFloat(setAsideAmount).toLocaleString()}`;
    if(calcOptionSysmbol != '%') displayCalcResults(value[0], value[1], string, i);
    else {
        // Percent Calculation: %
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
    utils1.calcResults.getIndex(i).value.textContent = string;
    netPayResults.textContent = `Spending Money: $${newNetPay}`;
    percentKeptResults.textContent = `You Keep ${percentageSaved}% of Your Net Pay!`;
}


// This function creates a new SetAside Specified by user
export function addSetAside(label) {
    if(label === null || label === utils1.empty) return;
    const newElement = utils1.getElements();
    const [div, input, calcType, deleteBtn, resultsEle] = utils1.setAttributes(newElement[0], newElement[2], newElement[4], newElement[5], newElement[6]);
    utils1.appendNodes(div, newElement[1], input, newElement[3], calcType, deleteBtn, label);
    utils1.addToList(input, calcType, resultsEle, label);
    utils3.listenForDeleteSetAside(deleteBtn);
    utils3.listenForCalcOption(2, utils1.calcOption.length);
    utils3.listenForUserInput(2, utils1.inputOptions.length);
    counter++;
    numberOfSetAside++;
}


// Deletes SetAside Inputs and their eventlisteners
export function deleteSetAside(i) {
    if(utils1.resultContainer.children[i].id === e.target.id) {
        e.target.parentElement.remove();
        e.target.remove();
        utils1.removeFromList(i);
        utils3.listenForCalcOption(2, utils1.calcOption.length);
        validateSetAsides();
        numberOfSetAside--;
        counter--;
    }
}


// Algorithm for changing the users calulation preference (calcOption)
export function changeCalcOption(e) {
    const isfixedNumCalculation = e.target.textContent != '#';
    if(isfixedNumCalculation) change(e, '#', '36.1px');
    else change(e, '%', '37px');
}

function change(e, option, width) {
    e.target.style.width = width;
    e.target.textContent = option; validateSetAsides();
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