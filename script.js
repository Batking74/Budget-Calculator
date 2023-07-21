const netIncome = document.getElementById('net-income');
const saveOption = document.getElementById('save-option');
const mortgageOption = document.getElementById('mortgage-option');
const insuranceOption = document.getElementById('insurance-option');
const waterBGEOption = document.getElementById('bge-water-option');
const emergenciesOption = document.getElementById('emergencies-option');
const btn = document.getElementById('btn');
const calcResults = document.querySelectorAll('.calculation-results');
const f = [saveOption, mortgageOption, insuranceOption, waterBGEOption, emergenciesOption];
const messages = [
    'Save Set Aside:',
    'Mortgage Set Aside:',
    'Insurance Set Aside:',
    'Water/BGE Set Aside:',
    'Emergency Set Aside:',
    'Net Pay:'
];

btn.addEventListener('click', () => {
    const end = calcResults.length - 1;
    const num = 10;
    if(netIncome.value === '') { alert('Must have a net income!'); }
    else {
        for(let element of f) {
            if(element.value === '') { validateSaveOption(0, end); }
        }
        validateSaveOption(0, end);
        validateMortgageOption(1, end, num);
        validateInsuranceOption(2, end, num);
        validateWaterBGEOption(3, end, num);
        validateEmergencyOption(4, end, num);
    }
})

function validateSaveOption(i, end) {
    if(saveOption.value != '') {
        const percentage = (netIncome.value * (saveOption.value / 100)).toFixed(2);
        const newNetPay = (netIncome.value - percentage).toFixed(2);
        displayCalcResults(newNetPay, percentage, messages[0], i, end);
    }
    else { 
        const percentage = calcResults[i].textContent;
        const newNetPay = netIncome.value + percentage;
        displayCalcResults(newNetPay, percentage, '', i, end);
    }
}

function validateMortgageOption(i, end, num) {
    if(mortgageOption.value != '') {
        const netPay = parseFloat(removeChar(calcResults[end].textContent.substring(num)));
        const percentage = (netPay * (mortgageOption.value / 100)).toFixed(2);
        const newNetPay = (netPay - percentage).toFixed(2);
        displayCalcResults(newNetPay, percentage, messages[1], i, end);
    }
    else {
        const netPay = parseFloat(removeChar(calcResults[end].textContent.substring(num)));
        const percentage = netPay * (mortgageOption.value / 100);
        const newNetPay = netPay + percentage;
        displayCalcResults(newNetPay, percentage, '', i, end);
    }
}

function validateInsuranceOption(i, end, num) {
    if(insuranceOption.value != '') {
        const netPay = parseFloat(removeChar(calcResults[end].textContent.substring(num)));
        const percentage = (netPay * (insuranceOption.value / 100)).toFixed(2);
        const newNetPay = (netPay - percentage).toFixed(2);
        displayCalcResults(newNetPay, percentage, messages[2], i, end);
    }
    else {
        const netPay = parseFloat(removeChar(calcResults[end].textContent.substring(num)));
        const percentage = netPay * (insuranceOption.value / 100);
        const newNetPay = netPay + percentage;
        displayCalcResults(newNetPay, percentage, '', i, end);
    }
}

function validateWaterBGEOption(i, end, num) {
    if(waterBGEOption.value != '') {
        const netPay = parseFloat(removeChar(calcResults[end].textContent.substring(num)));
        const percentage = (netPay * (waterBGEOption.value / 100)).toFixed(2);
        const newNetPay = (netPay - percentage).toFixed(2);
        displayCalcResults(newNetPay, percentage, messages[3], i, end);
    }
    else {
        const netPay = parseFloat(removeChar(calcResults[end].textContent.substring(num)));
        const percentage = netPay * (waterBGEOption.value / 100);
        const newNetPay = netPay + percentage;
        displayCalcResults(newNetPay, percentage, '', i, end);
    }
}

function validateEmergencyOption(i, end, num) {
    if(emergenciesOption.value != '') {
        const netPay = parseFloat(removeChar(calcResults[end].textContent.substring(num)));
        const percentage = (netPay * (emergenciesOption.value / 100)).toFixed(2);
        const newNetPay = (netPay - percentage).toFixed(2);
        displayCalcResults(newNetPay, percentage, messages[4], i, end);
    }
    else {
        const netPay = parseFloat(removeChar(calcResults[end].textContent.substring(num)));
        const percentage = netPay * (emergenciesOption.value / 100);
        const newNetPay = netPay + percentage;
        displayCalcResults(newNetPay, percentage, '', i, end);
    }
}

function displayCalcResults(newNetPay, percentage, message, i, end) {
    if(message != '') {
        calcResults[i].textContent = `${message} -$${percentage.toLocaleString('en-US')}`
        calcResults[end].textContent = `${messages[end]} $${newNetPay.toLocaleString('en-US')}`;
    }
    else {
        calcResults[i].textContent = message[i];
        calcResults[end].textContent = `${messages[end]} $${newNetPay.toLocaleString('en-US')}`;
    }
}

function removeChar(string) {
    let newString = '';
    for(let i = 0; i < string.length; i++) {
        let letter = string.substring(i, i + 1);
        if(letter === ',') { letter = ''; }
        else { newString += letter; }
    }
    return newString;
}