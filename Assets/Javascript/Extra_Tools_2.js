import * as tools1 from './ExtraTools.js';

// Appends All log elements to the document
export function appendElements(element) {
    element[0].append(element[6]);
    element[0].append(element[7]);
    element[0].append(element[9]);
    element[0].append(element[12]);
    element[12].append(element[8]);
    element[12].append(element[11]);
    element[0].append(element[4]);
}


// Displays All Records of SetAsides in the log Section
export function displayElements(element, log, key) {

    // Displays Date Element
    element[6].setAttribute('class', 'date-log');
    element[6].append(`${log.Log.Date}`);
    
    // Displays Net Pay Element
    element[7].setAttribute('class', 'netpay-log');
    element[7].append(`Net Pay: ${log.Log.Netpay}`);
    
    // Displays Each SetAside
    displaySetAsides(log.Log.SetAsides, element);
    
    // Displays Spending Money/Percentage Kept Elements
    element[12].setAttribute('class', 'overall-calc-leftovers-container-log');
    element[8].append(`Spending Money: ${log.Log.Spending_Money} `);
    element[11].append(`Percentage of Netpay kept: ${log.Log.Percentage_Kept}`);
    
    // Displays Delete Btn
    element[4].setAttribute('class', 'delete-log-btn');
    element[4].setAttribute('id', key);
    element[4].append(`Delete`);
}


// Displays Each SetAside
function displaySetAsides(setAsides, element) {
    for(let setAsideObject of setAsides) {
        const setAsideElement = document.createElement('p');
        setAsideElement.append(`${setAsideObject.SetAside_Name}: `);
        setAsideElement.append(`${setAsideObject.Calculation_Amount} `);
        checkAsideCalculation(setAsideObject, setAsideElement);
        element[9].setAttribute('class', 'setAside-log-container');
        element[9].append(setAsideElement);
    }
}


// Checks if a setaside is a percentage or whole number and displays HTML based on that.
function checkAsideCalculation(aside, setAsideElement) {
    if(aside.Calculation_Type === '#') {
        setAsideElement.append(` of ${(aside.SetAside_Netpay).toLocaleString()}`);
    }
    else {
        setAsideElement.append(`(${aside.Calculation_Type} of ${(aside.SetAside_Netpay).toLocaleString()})`);
    }
}


// Retreives Users Spending Cash, and Overall Percentage kept from the output and returns it.
export function getFinalNetPay(netPayResults, percentKeptResults) {
    const index4 = netPayResults.textContent.indexOf('$');
    const index3 = percentKeptResults.textContent.indexOf('p');
    const index5 = percentKeptResults.textContent.indexOf('of');
    const spending$ = netPayResults.textContent.substring(index4);
    const $kept = percentKeptResults.textContent.substring(index3 + 2, index5 - 1);
    return [spending$, $kept];
}


// Returns all new SetAside data before creating a record in SQL Database
export function getSetAsides(netpays) {
    const setAsides = [];
    for(let i = 0; i < tools1.calcResults.length; i++) {
        const object = tools1.getCalcResults(i, netpays);
        if(!(object === null)) setAsides.push(object);
    } return setAsides;
}