import * as main from './script.js';
import * as utils1 from './utils1.js';

// Displays All details in Log Container except for SetAsides
export function showLogDetails(container, i) {
    // Create HTML Elements
    let [logDiv,,,,deleteBtn,,date,netpay,spending,setasideContainer,,percentKept,reslog] = utils1.getElements();
    container.children[0].insertAdjacentElement('afterend', logDiv);
    main.logEmptyMsg.style.display = 'none';
    main.logContainer.style.height = 'fit-content';
    // Seting Element Attributes
    setElementAttributes(i, logDiv, date, netpay, setasideContainer, reslog, deleteBtn);

    // Append Elements to log Container
    appendLogElementsToContainer(logDiv, date, netpay, setasideContainer, reslog, deleteBtn);

    // Append SetAide Info to Elements
    appendSetAsideInfoToElements(i, date, netpay, reslog, spending, percentKept, deleteBtn);
}


// Displays All SetAsides in Log Container
export function showAllSetAsidesInLog(container, i, j) {
    const ele = document.createElement('p');
    const path = main.logs[i].SetAsides[j];
    ele.append(`${path.SetAside_Name}: `);
    ele.append(`${path.Calculation_Amount} `);
    if(path.Calculation_Type === '#') {
        ele.append(` of ${(path.SetAside_Netpay).toLocaleString()}`);
    }
    else {
        ele.append(`(${path.Calculation_Type} of ${(path.SetAside_Netpay).toLocaleString()})`);
    }
    container.children[1].children[2].append(ele);
}


// Appends Elements to log Container
export function appendLogElementsToContainer(logDiv, ...elements) {
    logDiv.append(elements[0]);
    logDiv.append(elements[1]);
    logDiv.append(elements[2]);
    logDiv.append(elements[3]);
    logDiv.append(elements[4]);
}


// Appends SetAside Info Elements in each log Container
export function appendSetAsideInfoToElements(i, ...elements) {
    elements[0].append(`${main.logs[i].Date}`);
    elements[1].append(`Net Pay: ${main.logs[i].Netpay}`);
    elements[2].append(elements[3]);
    elements[2].append(elements[4]);
    elements[3].append(`Spending Money: ${main.logs[i].Spending_Money} `);
    elements[4].append(`Percentage of Netpay kept: ${main.logs[i].Total_Percentage_Kept}`);
    elements[5].append(`Delete`);
}


// Sets All Log Container Element Attributes
function setElementAttributes(i, ...elements) {
    elements[0].setAttribute('class', 'log-dropDown');
    elements[1].setAttribute('class', 'date-log');
    elements[2].setAttribute('class', 'netpay-log');
    elements[3].setAttribute('class', 'setAside-log-container');
    elements[4].setAttribute('class', 'overall-calc-leftovers-container-log');
    elements[5].setAttribute('class', 'delete-log-btn');
    elements[5].setAttribute('id', main.logs[i].id);
}


// Returns all new SetAside data before creating a record in SQL Database
export function getSetAsides() {
    const setAsides = [];
    for(let i = 0; i < utils1.calcResults.length; i++) {
        const object = utils1.getCalcResults(i, main.netpays);
        if(!(object === null)) setAsides.push(object);
    } return setAsides;
}


// Retreiving output results in the result/output section
export function getFinalNetPay() {
    const index4 = main.netPayResults.textContent.indexOf('$');
    const index3 = main.percentKeptResults.textContent.indexOf('p');
    const index5 = main.percentKeptResults.textContent.indexOf('of');
    const spending$ = main.netPayResults.textContent.substring(index4);
    const $kept = main.percentKeptResults.textContent.substring(index3 + 2, index5 - 1);
    return [spending$, $kept];
}

export function initCalculator() {
    // Displays Logs if its not empty
    if(main.logs.length != 0) {
        main.logEmptyMsg.textContent = '';
        main.displayAllLogs(main.logContainer);
    }

    // Filling in Linked lists with elements
    for(let i = 1; i >= 0; i--) {
        utils1.inputOptions.insertAtIndex(0, main.setAsides[i]);
        utils1.calcOption.insertAtIndex(0, main.calcOptions[i]);
        utils1.calcResults.insertAtIndex(0, main.results[i]);
    }
}