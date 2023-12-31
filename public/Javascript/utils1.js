import LinkedList from './linkedlist.js';
import * as tool from './script.js';
export const setasideContainer = document.getElementById('setaside-container');
export const resultContainer = document.getElementById('results-container');
export let netIncome = document.getElementById('net-income');
export const inputOptions = new LinkedList();
export const calcResults = new LinkedList();
export const setAsideMsg = new LinkedList();
export const calcOption = new LinkedList();
const date = new Date();
export const empty = '';
export const text = [
    'All inputs must be used!',
    'What is the name of this set aside?',
    'Must have a Net Pay!',
    'SetAside Limit Reached!',
    'new-setAside',
    'calculation-results',
    'Spending Money',
    'Are you sure you want to delete this setAside log? You will not be able to recover this log once this action is done.'
];


// Creating Dynamic Reusable HTML Elements 
export function getElements() {
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    const div3 = document.createElement('div');
    const div4 = document.createElement('div');
    const label = document.createElement('label');
    const input = document.createElement('input');
    const span = document.createElement('span');
    const btn1 = document.createElement('button');
    const btn2 = document.createElement('button');
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    const p3 = document.createElement('p');
    const p4 = document.createElement('p');
    return [div1, label, input, span, btn1, btn2, p1, p2, p3, div2, div3, p4, div4];
}


// Setting new SetAside Attributes
export function setAttributes(newDiv, newInput, newCalcOptionBtn, deleteBtn, newResult) {
    newDiv.setAttribute('class', 'new-setaside')
    newInput.setAttribute('type', 'number');
    newInput.setAttribute('data-setaside', 'newSetaside');
    newInput.setAttribute('id', tool.counter - 1);
    newResult.setAttribute('class', text[5]);
    newResult.setAttribute('id', tool.numberOfSetAside);
    newCalcOptionBtn.setAttribute('class', 'calc-option-btn');
    newCalcOptionBtn.setAttribute('data-calc-option', 'newBtn');
    newCalcOptionBtn.setAttribute('id', tool.counter);
    deleteBtn.setAttribute('class', 'delete-set-aside');
    deleteBtn.setAttribute('id', tool.numberOfSetAside);
    return [newDiv, newInput, newCalcOptionBtn, deleteBtn, newResult];
}


// Adds the new SetAside to HTML document when user creates a new setAside
export function appendNodes(newDiv, newLabel, newInput, newSpan, newCalcOptionBtn, deleteBtn, label) {
    setasideContainer.appendChild(newDiv);
    newDiv.appendChild(newLabel);
    newDiv.appendChild(newInput);
    newDiv.appendChild(newSpan);
    newSpan.appendChild(newCalcOptionBtn);
    newDiv.appendChild(deleteBtn);
    newCalcOptionBtn.textContent = '%';
    newLabel.textContent = label;
    deleteBtn.textContent = 'X';
}


// Adds Setaside info to all Linked lists when user creates a new setAside
export function addToList(newInput, newCalcOptionBtn, newResult, label) {
    const reverse = tool.counter - 1;
    resultContainer.insertBefore(newResult, resultContainer.children[tool.counter]);
    calcResults.insertAtIndex(reverse, newResult);
    setAsideMsg.insertAtIndex(reverse, `${label} Set Aside`);
    inputOptions.insertAtIndex(reverse, newInput);
    calcOption.insertAtIndex(reverse, newCalcOptionBtn);
}


// Removes SetAside info from all linked lists when user decides to delete one
export function removeFromList(i) {
    const index = i - 1;
    resultContainer.children[i].remove();
    calcResults.removeIndex(index);
    setAsideMsg.removeIndex(index);
    inputOptions.removeIndex(index);
    calcOption.removeIndex(index);
}


// Removes all characters from the string parameter
export function removeChar(string) {
    let newString = '';
    for(let i = 0; i < string.length; i++) {
        let letter = string.substring(i, i + 1);
        if(letter === ',') letter = '';
        else if(letter === '$') letter = '';
        else newString += letter;
    } return newString;
}


// Returns an object of all the new SetAsides details before creating a new record in Database
export function getCalcResults(i, netpays) {
    if(inputOptions.getIndex(i).value.value == empty) return null;
    const ele = calcResults.getIndex(i).value;
    const index1 = ele.textContent.indexOf('-');
    const index2 = ele.textContent.indexOf('Set Aside');
    const deduction = ele.textContent.substring(index1);
    let calcType = ele.textContent.substring(index2 + 10, index1 - 2);
    const name = ele.textContent.substring(0, index2 - 1);
    const option = calcOption.getIndex(i).value.textContent;
    if(option === '#') calcType = '#';
    return {
        SetAside_Name: name,
        SetAside_Netpay: `$${parseFloat(netpays[i]).toLocaleString()}`,
        Calculation_Type: calcType,
        Calculation_Amount: deduction
    };
}


// Validates netpay input feild
export function hasNetIncome() {
    if(netIncome.value === empty) {
        alert(text[2]);
        return false;
    } else return true;
}


// Checks if the maximum SetAsides have been reached
export function limitNotReached() {
    if(!(tool.numberOfSetAside <= 50)) {
        alert(text[3]);
        return false;
    } else return true;
}


// Returns all the months in the year
export function getMonths() {
    const months = [];
    for (let i = 0; i < 12; i++) {
        date.setMonth(i);
        months.push(date.toLocaleString("en-US", { month: 'long' }));
    } return months;
}