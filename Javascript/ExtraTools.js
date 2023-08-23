import LinkedList from '../Javascript/linkedlist.js';
import {numberOfSetAside, counter, logContainer, logs, s} from '../Javascript/script.js';
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
}

export function appendNodes(newDiv, newLabel, newInput, newSpan, newCalcOptionBtn, deleteBtn, btnText, deleteText, label) {
    const newLabelText = document.createTextNode(label);
    setasideContainer.appendChild(newDiv);
    newDiv.appendChild(newLabel);
    newLabel.appendChild(newLabelText);
    newDiv.appendChild(newInput);
    newDiv.appendChild(newSpan);
    newSpan.appendChild(newCalcOptionBtn);
    newCalcOptionBtn.appendChild(btnText);
    newDiv.appendChild(deleteBtn);
    deleteBtn.appendChild(deleteText);
}

export function createElements() {
    const newDiv = document.createElement('div');
    const newLabel = document.createElement('label');
    const newInput = document.createElement('input');
    const newSpan = document.createElement('span');
    const newCalcOptionBtn = document.createElement('button');
    const deleteBtn = document.createElement('button');
    const newResult = document.createElement('p');
    const btnText = document.createTextNode('%');
    const deleteText = document.createTextNode('X');
    return [newDiv, newLabel, newInput, newSpan, newCalcOptionBtn, deleteBtn, newResult, btnText, deleteText];
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
    }
    return newString;
}

export function getCalcResults(i) {
    if(inputOptions.getIndex(i).value.value == empty) return null;
    const index1 = calcResults.getIndex(i).value.textContent.indexOf('-');
    const index2 = calcResults.getIndex(i).value.textContent.indexOf('Set Aside');
    const deduction = calcResults.getIndex(i).value.textContent.substring(index1);
    let percentage = calcResults.getIndex(i).value.textContent.substring(index2 + 10, index1 - 2);
    const name = calcResults.getIndex(i).value.textContent.substring(0, index2 - 1);
    const option = calcOption.getIndex(i).value.textContent;
    if(option === '#') percentage = 'None';
    return { SetAside_Name: name, SetAside_Percentage: percentage, Percentage_Amount: deduction };
}

export function displayLoggedSetAsides() {
    const months = [];
    for (let i = 0; i < 12; i++) {
        date.setMonth(i);
        months.push(date.toLocaleString("en-US", { month: 'long' }));
    }
    logs.forEach(setAside => {
        months.forEach(month => {
            const monthBtn = document.createElement('button');
            const div = document.createElement('div');
            div.setAttribute('class', 'disabled-collapse');
            monthBtn.setAttribute('class', 'log-collapse-btn');
            monthBtn.textContent = month;
            logContainer.append(monthBtn);
            logContainer.append(div);
            monthBtn.addEventListener('click', (e) => {
                e.target.nextElementSibling.classList.toggle('active')
                if(e.target.textContent.substring(0, 3) === setAside.Date.substring(8, 11)) {
                    s(e.target.nextElementSibling);
                    console.log(e.target.textContent)
                }
            })
        })
    })
}

export function getNodeFrom(list, index) { { return list.getIndex(index).value; } }
export function getNewSetAside() { return setasideContainer.children[counter - 1].children[1] }
export function getInputDivs() { return setasideContainer.getElementsByTagName('div'); }
export function hasNetIncome() {
    if(netIncome.value === empty) { alert(text[2]); return false; }
    else return true;
}
export function limitNotReached() {
    if(!(numberOfSetAside <= 12)) { alert(text[3]); return false; }
    else return true;
}