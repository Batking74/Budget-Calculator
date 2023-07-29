import LinkedList from "./linkedlist.js";
const mainContainer = document.getElementById('main-container');
let netIncome = document.getElementById('net-income');
const saveOption = document.getElementById('save-option');
const billsOption = document.getElementById('bills-option');
const calcBtn = document.getElementById('btn');
const setAsideBtn = document.getElementById('set-aside-btn');
const clearBtn = document.getElementById('clear-btn');
const calcPercentageBtn1 = document.getElementById('calc-percent-btn-1');
const calcFixedNumBtn1 = document.getElementById('calc-fixedNum-btn-1');
const calcPercentageBtn2 = document.getElementById('calc-percent-btn-2');
const calcFixedNumBtn2 = document.getElementById('calc-fixedNum-btn-2');
const resultContainer = document.getElementById('results');
const saveResults = document.getElementById('save-aside-results');
const billsResults = document.getElementById('bill-saide-results');
let netPayResults = document.getElementById('netpay-aside-results');
let percentKeptResults = document.getElementById('total-percentage-kept-results');
const inputOptions = new LinkedList();
const calcResults = new LinkedList();
const setAsideMsg = new LinkedList();

let isPercentCalculation = [ [true, true], [true, true] ];
let clacOption = [ [calcPercentageBtn1, calcFixedNumBtn1], [calcPercentageBtn2, calcFixedNumBtn2] ];

inputOptions.insertAtHead(billsOption);
inputOptions.insertAtHead(saveOption);
calcResults.insertAtHead(billsResults);
calcResults.insertAtHead(saveResults);
setAsideMsg.insertAtHead('Bills Set Aside');
setAsideMsg.insertAtHead('Save Set Aside');
const text = [
    'All inputs must be used!',
    'What is the name of this set aside?',
    'Must have a net income!',
    'user-new-setAside',
    'calculation-results'
]

let numberOfSetAside = 0;
let count2 = 3;
const empty = '';
const containerLength = calcResults.length;

setAsideBtn.addEventListener('click', () => {
    if(hasNetIncome()) {
        for(let i = 0; i < inputOptions.length; i++) {
            if(inputOptions.getIndex(i).value.value === empty) inputOptions.getIndex(i).value.value = 0;
        }
        validateSetAsides();
        addSetAside(prompt(text[1]));
    }
})

document.addEventListener('keyup', (key) => { if(key.key === 'Enter') validateSetAsides() });
calcBtn.addEventListener('click', () => validateSetAsides());
clearBtn.addEventListener('click', () => {
    for(let i = 0; i < inputOptions.length; i++) {
        netIncome.value = empty;
        inputOptions.getIndex(i).value.value = empty;
    }
})

function validateSetAsides() {
    const netPayValue = netIncome.value;
    if(hasNetIncome()) {
        const msg = getNodeFrom(setAsideMsg, containerLength - 2);
        const num = (msg.length) + 2;
        netPayResults.textContent = `${msg}: $${netPayValue}`;
        for(let i = 0; i < inputOptions.length; i++) {
            hasNewSetAsides();
            const label = getNodeFrom(setAsideMsg, i);
            let inputData = getNodeFrom(inputOptions, i);
            if(inputData.value === empty) getNodeFrom(calcResults, i).textContent = empty;
            else if(inputData.value === undefined) return;
            else calculate(netPayValue, inputData, label, num, i);
        }
    }
}

function hasNewSetAsides() {
    const newSetAsideValue = getNewSetAside().value;
    let setAsideId = getInputDivs()[inputOptions.length].childNodes[1].id;
    if(inputOptions.length > 2 && newSetAsideValue != undefined && setAsideId === text[3]) {
        inputOptions.getIndex(inputOptions.length - 1).value = mainContainer.children[count2 - 1].children[1];
        return true;
    }
    else return false;
}

function calculate(netPayValue, inputData, label, num, i) {
    clacOption[i].forEach(element => {
        element.addEventListener('click', (e) => {
            if(!(e.target.disabled) && e.target.id.substring(5, 12) === 'percent') {
                isPercentCalculation[i][i] = true;
                console.log('hoe')
            }
            else {
                console.log('hoebo')
                isPercentCalculation[i][i] = false;
            }
        })
    })

    const netPay = parseFloat(removeChar(netPayResults.textContent.substring(num)));
    let setAsideAmount;
    if(isPercentCalculation[i][i]) {
        setAsideAmount = (netPay * (inputData.value / 100)).toFixed(2);
        const value = calculateNewNetPay(netPay, netPayValue, setAsideAmount);
        displayCalcResults(value[0], inputData, label, setAsideAmount, value[1], i);
    }
    else {
        setAsideAmount = (inputData.value);
        const value = calculateNewNetPay(netPay, netPayValue, setAsideAmount);
        displayCalcResults(value[0], inputData, label, setAsideAmount, value[1], i);
        
    }
}

function calculateNewNetPay(netPay, netPayValue, setAsideAmount) {
    const newNetPay = (netPay - setAsideAmount).toFixed(2);
    const percentageSaved = ((newNetPay / netPayValue) * 100).toFixed(0);
    const arr = [newNetPay, percentageSaved];
    return arr;
}
    
function displayCalcResults(newNetPay, inputData, label, setAsideAmount, percentageSaved, i) {
    console.log(`${newNetPay} ${setAsideAmount}`)
    if(isPercentCalculation[i][i]) {
        getNodeFrom(calcResults, i).textContent = `${label} ${inputData.value}%: -$${setAsideAmount}`;
        netPayResults.textContent = `Spending Money: $${newNetPay.toLocaleString()}`;
        percentKeptResults.textContent = `You Keep ${percentageSaved}% of Your Net Pay!`;
    }
    else {
        getNodeFrom(calcResults, i).textContent = `${label}: -$${setAsideAmount}`;
        netPayResults.textContent = `Spending Money: $${newNetPay.toLocaleString()}`;
        percentKeptResults.textContent = `You Keep ${percentageSaved}% of Your Net Pay!`;

    }
}

function removeChar(string) {
    let newString = '';
    for(let i = 0; i < string.length; i++) {
        let letter = string.substring(i, i + 1);
        if(letter === ',') letter = '';
        else if(letter === '$') letter = '';
        else newString += letter;
    }
    return newString;
}

function addSetAside(label) {
    if(label === null || label === empty) return;
    const setAsideDiv = document.createElement('div');
    const newLabel = document.createElement('label');
    const newInput = document.createElement('input');
    const newSpan = document.createElement('span');
    const calculatePercentbtn = document.createElement('button');
    const calculateFixedNumbtn = document.createElement('button');
    const newResultElement = document.createElement('p');

    const newText = document.createTextNode(label);
    const percentage = document.createTextNode('%');
    const fixedNum = document.createTextNode('#');
    newInput.setAttribute('type', 'number');
    newInput.setAttribute('placeholder', '%');
    newInput.setAttribute('id', text[3]);
    newResultElement.setAttribute('class', text[4]);
    calculateFixedNumbtn.setAttribute('class', 'test btn');
    calculateFixedNumbtn.setAttribute('id', 'calc-fixedNum-btn');
    calculatePercentbtn.setAttribute('class', 'test');
    calculatePercentbtn.setAttribute('id', 'calc-percent-btn');

    mainContainer.appendChild(setAsideDiv);
    setAsideDiv.appendChild(newLabel);
    newLabel.appendChild(newText);
    setAsideDiv.appendChild(newInput);
    setAsideDiv.appendChild(newSpan);
    newSpan.appendChild(calculatePercentbtn)
    newSpan.appendChild(calculateFixedNumbtn)
    calculateFixedNumbtn.appendChild(fixedNum);
    calculatePercentbtn.appendChild(percentage);
    const reverse = count2 - 1;

    resultContainer.insertBefore(newResultElement, resultContainer.children[count2]);
    calcResults.insertAtIndex(reverse, newResultElement);
    setAsideMsg.insertAtIndex(reverse, `${label} Set Aside`);
    inputOptions.insertAtIndex(reverse, newInput.value);
    
    numberOfSetAside++;
    count2++;
}

const getNodeFrom = (list, index) => { return list.getIndex(index).value; }
function getNewSetAside() { return mainContainer.children[count2 - 1].children[1] }
function getInputDivs() { return mainContainer.getElementsByTagName('div'); }
function hasNetIncome() {
    if(netIncome.value === empty) { alert(text[2]); return false; }
    else return true;
}