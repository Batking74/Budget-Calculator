import LinkedList from '../Javascript/linkedlist.js';
import {numberOfSetAside, counter} from '../Javascript/script.js';
export const mainContainer = document.getElementById('main-container');
export let netIncome = document.getElementById('net-income');
export const resultContainer = document.getElementById('results');
export const inputOptions = new LinkedList();
export const calcResults = new LinkedList();
export const setAsideMsg = new LinkedList();
export const percentCalc = new LinkedList();
export const fixedNumCalc = new LinkedList();
export const empty = '';
export const text = [
    'All inputs must be used!',
    'What is the name of this set aside?',
    'Must have a net income!',
    'SetAside Limit Reached!',
    'user-new-setAside',
    'calculation-results'
];

export function setAttributes(newInput, newResultElement, newCalcPercentBtn, newCalcFixedNumBtn, deleteSetAside, label) {
    newInput.setAttribute('type', 'number');
    newInput.setAttribute('placeholder', '%');
    newInput.setAttribute('id', text[4]);
    newInput.setAttribute('data-setAside', `${label}`);
    newResultElement.setAttribute('class', text[5]);
    newResultElement.setAttribute('id', text[4]);
    newCalcPercentBtn.setAttribute('class', 'test');
    newCalcPercentBtn.setAttribute('id', `0`);
    newCalcPercentBtn.setAttribute('data-calc-percentage', `${counter}`);
    newCalcPercentBtn.setAttribute('data-isActive', 'true');
    newCalcFixedNumBtn.setAttribute('class', 'test btn');
    newCalcFixedNumBtn.setAttribute('id', `1`);
    newCalcFixedNumBtn.setAttribute('data-calc-whole-num', `${counter}`);
    newCalcFixedNumBtn.setAttribute('data-isActive', 'false');
    deleteSetAside.setAttribute('class', 'delete-set-aside');
    deleteSetAside.setAttribute('id', `${counter}`);
}

export function appendNodes(newInput, setAsideDiv, newCalcPercentBtn, newCalcFixedNumBtn, label, deleteSetAside) {
    const newLabel = document.createElement('label');
    const newSpan = document.createElement('span');
    const newText = document.createTextNode(label);
    const percentage = document.createTextNode('%');
    const fixedNum = document.createTextNode('#');
    const deleteText = document.createTextNode('X');
    mainContainer.appendChild(setAsideDiv);
    setAsideDiv.appendChild(newLabel);
    newLabel.appendChild(newText);
    setAsideDiv.appendChild(newInput);
    setAsideDiv.appendChild(newSpan);
    setAsideDiv.appendChild(deleteSetAside);
    deleteSetAside.appendChild(deleteText);
    newSpan.appendChild(newCalcPercentBtn);
    newSpan.appendChild(newCalcFixedNumBtn);
    newCalcPercentBtn.appendChild(percentage);
    newCalcFixedNumBtn.appendChild(fixedNum);
}

export function createElements() {
    const setAsideDiv = document.createElement('div');
    const newInput = document.createElement('input');
    const newCalcPercentBtn = document.createElement('button');
    const newCalcFixedNumBtn = document.createElement('button');
    const deleteSetAside = document.createElement('button');
    const newResultElement = document.createElement('p');
    return [setAsideDiv, newInput, newCalcPercentBtn, newCalcFixedNumBtn, deleteSetAside, newResultElement];
}

export function addToList(newInput, newResultElement, newCalcPercentBtn, newCalcFixedNumBtn, label) {
    const reverse = counter - 1;
    resultContainer.insertBefore(newResultElement, resultContainer.children[counter]);
    calcResults.insertAtIndex(reverse, newResultElement);
    setAsideMsg.insertAtIndex(reverse, `${label} Set Aside`);
    inputOptions.insertAtIndex(reverse, newInput);
    percentCalc.insertAtIndex(reverse, newCalcPercentBtn);
    fixedNumCalc.insertAtIndex(reverse, newCalcFixedNumBtn);
}

export function removeFromList(index) {
    const element = index - 1;
    calcResults.removeIndex(element);
    setAsideMsg.removeIndex(element);
    inputOptions.removeIndex(element);
    percentCalc.removeIndex(element);
    fixedNumCalc.removeIndex(element);
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

export function getNodeFrom(list, index) { { return list.getIndex(index).value; } }
export function getNewSetAside() { return mainContainer.children[counter - 1].children[1] }
export function getInputDivs() { return mainContainer.getElementsByTagName('div'); }
export function hasNetIncome() {
    if(netIncome.value === empty) { alert(text[2]); return false; }
    else return true;
}
export function limitNotReached() {
    if(!(numberOfSetAside <= 21)) { alert(text[3]); return false; }
    else return true;
}