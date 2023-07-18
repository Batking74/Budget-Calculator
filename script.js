const netIncome = document.getElementById('net-income');
const saveOption = document.getElementById('save-option');
const mortgageOption = document.getElementById('mortgage-option');
const insuranceOption = document.getElementById('insurance-option');
const waterBGEOption = document.getElementById('bge-water-option');
const emergenciesOption = document.getElementById('emergencies-option');
const btn = document.getElementById('btn');
const calcResults = document.querySelectorAll('.calculation-results');

btn.addEventListener('click', () => {
    const message = 'New Net Pay:';
    const end = calcResults.length - 1;
    if(netIncome.value === '') {
        alert('Must have a net income!');
    }
    if(!(saveOption.value === '')) {
        const percentage = netIncome.value * (saveOption.value / 100);
        const newNetPay = netIncome.value - percentage;
        calcResults[0].textContent = `Save Set Aside: $${percentage.toFixed(2)}`
        calcResults[end].textContent = `${message} $${newNetPay.toLocaleString('en-US')}`;
    }
    if(mortgageOption.value != '') {
        const netPay = parseFloat(removeChar(calcResults[end].textContent.substring(14)));
        const percentage = netPay * (mortgageOption.value / 100);
        const newNetPay = (netPay - percentage).toLocaleString('en-US');
        calcResults[1].textContent = `Mortgage Set Aside: $${percentage.toFixed(2)}`
        calcResults[end].textContent = `${message} $${newNetPay}`;
    }
    if(insuranceOption.value != '') {
        const netPay = parseFloat(removeChar(calcResults[end].textContent.substring(14)));
        const percentage = netPay * (insuranceOption.value / 100);
        const newNetPay = (netPay - percentage).toLocaleString('en-US');
        calcResults[2].textContent = `Insurance Set Aside: $${percentage.toFixed(2)}`
        calcResults[end].textContent = `${message} $${newNetPay}`;
    }
    if(waterBGEOption.value != '') {
        const netPay = parseFloat(removeChar(calcResults[end].textContent.substring(14)));
        const percentage = netPay * (waterBGEOption.value / 100);
        const newNetPay = (netPay - percentage).toLocaleString('en-US');
        calcResults[3].textContent = `Water/BGE Set Aside: $${percentage.toFixed(2)}`
        calcResults[end].textContent = `${message} $${newNetPay}`;
    }
    if(emergenciesOption.value != '') {
        const netPay = parseFloat(removeChar(calcResults[end].textContent.substring(14)));
        const percentage = netPay * (emergenciesOption.value / 100);
        const newNetPay = (netPay - percentage).toLocaleString('en-US');
        calcResults[4].textContent = `Emergency Set Aside: $${percentage.toFixed(2)}`
        calcResults[end].textContent = `${message} $${newNetPay}`;
    }
})

function removeChar(string) {
    let newString = '';
    for(let i = 0; i < string.length; i++) {
        let letter = string.substring(i, i + 1);
        if(letter === ',') { letter = ''; }
        else { newString += letter; }
    }
    return newString;
}