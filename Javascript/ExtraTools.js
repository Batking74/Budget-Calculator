import LinkedList from '../Javascript/linkedlist.js';
import {numberOfSetAside, counter, logContainer, logs, displayAllLogs} from '../Javascript/script.js';
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
    'Must have a net income!',
    'SetAside Limit Reached!',
    'new-setAside',
    'calculation-results'
];

export function getElement() {
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    const div3 = document.createElement('div');
    const label = document.createElement('label');
    const input = document.createElement('input');
    const span = document.createElement('span');
    const btn = document.createElement('button');
    const btn2 = document.createElement('button');
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    const p3 = document.createElement('p');
    return [div1, label, input, span, btn, btn2, p1, p2, p3, div2, div3];
}

export function setAttributes(newDiv, newInput, newCalcOptionBtn, deleteBtn, newResult) {
    newDiv.setAttribute('class', 'new-setaside')
    newInput.setAttribute('type', 'number');
    newInput.setAttribute('data-setaside', 'newSetaside');
    newInput.setAttribute('id', counter - 1);
    newResult.setAttribute('class', text[5]);
    newResult.setAttribute('id', numberOfSetAside);
    newCalcOptionBtn.setAttribute('class', 'calc-option-btn');
    newCalcOptionBtn.setAttribute('data-calc-option', 'newBtn');
    deleteBtn.setAttribute('class', 'delete-set-aside');
    deleteBtn.setAttribute('id', numberOfSetAside);
    return [newDiv, newInput, newCalcOptionBtn, deleteBtn, newResult];
}

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

export function addToList(newInput, newCalcOptionBtn, newResult, label) {
    const reverse = counter - 1;
    resultContainer.insertBefore(newResult, resultContainer.children[counter]);
    calcResults.insertAtIndex(reverse, newResult);
    setAsideMsg.insertAtIndex(reverse, `${label} Set Aside`);
    inputOptions.insertAtIndex(reverse, newInput);
    calcOption.insertAtIndex(reverse, newCalcOptionBtn);
}

export function removeFromList(i) {
    const index = i - 1;
    resultContainer.children[i].remove();
    calcResults.removeIndex(index);
    setAsideMsg.removeIndex(index);
    inputOptions.removeIndex(index);
    calcOption.removeIndex(index);
}

export function removeChar(string) {
    let newString = '';
    for(let i = 0; i < string.length; i++) {
        let letter = string.substring(i, i + 1);
        if(letter === ',') letter = '';
        else if(letter === '$') letter = '';
        else newString += letter;
    } return newString;
}

export function getCalcResults(i) {
    if(inputOptions.getIndex(i).value.value == empty) return null;
    const index1 = calcResults.getIndex(i).value.textContent.indexOf('-');
    const index2 = calcResults.getIndex(i).value.textContent.indexOf('Set Aside');
    const deduction = calcResults.getIndex(i).value.textContent.substring(index1);
    let percentage = calcResults.getIndex(i).value.textContent.substring(index2 + 10, index1 - 2);
    const name = calcResults.getIndex(i).value.textContent.substring(0, index2 - 1);
    const option = calcOption.getIndex(i).value.textContent;
    if(option === '#') percentage = 'Whole Number';
    return { SetAside_Name: name, SetAside_Percentage: percentage, Percentage_Amount: deduction };
}

export function displayLoggedSetAsides() {
    const months = getMonths();
    months.forEach(month => {
        const element = getElement();
        element[0].setAttribute('class', 'disabled-collapse');
        element[4].setAttribute('class', 'log-collapse-btn');
        element[4].textContent = month;
        logContainer.append(element[4]);
        logContainer.append(element[0]);
        element[4].addEventListener('click', (e) => {
            e.target.nextElementSibling.classList.toggle('active');
            displayOldLog(e);
        })
    })
}

export function getNodeFrom(list, index) { { return list.getIndex(index).value; } }
export function getNewSetAside() { return setasideContainer.children[counter - 1].children[1] }
export function getInputDivs() { return setasideContainer.getElementsByTagName('div'); }
export function hasNetIncome() {
    if(netIncome.value === empty) { alert(text[2]); return false; } else return true;
}

export function limitNotReached() {
    if(!(numberOfSetAside <= 12)) { alert(text[3]); return false; } else return true;
}

export function getMonths() {
    const months = [];
    for (let i = 0; i < 12; i++) {
        date.setMonth(i);
        months.push(date.toLocaleString("en-US", { month: 'long' }));
    } return months;
}

function displayOldLog(e) {
    // Add condition to display old logs in collapse element
}