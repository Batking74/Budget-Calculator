import * as main from './script.js';
import * as utils1 from './utils1.js';
import * as utils2 from './utils2.js';

// Deletes A log from database if user confirms
export async function deleteLog(id) {
    if(confirm(utils1.text[7])) {
        try {
            const res = (await (await fetch(`/setAside/${id}`, {
                method: 'DELETE',
                headers: { 'Content-type': 'application/json' }
            })).json())
            return res;
        }
        catch (error) {
            console.log(error);
        }
    }
}

// Creates a new Record log in SQL Database
export async function createLog(arr, finalResults) {
    if(!(arr.length == 0)) {
        try {
            const response = (await fetch('/setAside', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Netpay: `$${parseFloat(utils1.netIncome.value).toLocaleString()}`,
                    SetAsides: arr,
                    Spending_Money: finalResults[0],
                    Percentage_Kept: finalResults[1]
                })
            })).json();
            location.reload();
            return response;
        }
        catch (error) {
            console.log(error);
        }
    }
}


// Sets all button event listeners
export function setAllEventListeners() {
    // When you click on "Add SetAside" it will validate then add a new SetAside
    document.getElementById('set-aside-btn').addEventListener('click', () => {
        if(utils1.hasNetIncome() && utils1.limitNotReached()) {
            main.addSetAside(prompt(utils1.text[1]));
        }
    });

    // When you click on a "Delete" Button in the SetAside Log Section it will delete the specified SetAside
    document.querySelectorAll('.delete-log-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            try {
                const res = await deleteLog(e.target.id);
                e.target.parentElement.remove();
                return res;
            }
            catch (error) {
                console.log(error);
            }
        })
    })

    // onClick Clear all input in SetAsides
    document.getElementById('clear-btn').addEventListener('click', () => {
        for(let i = 0; i < utils1.inputOptions.length; i++) {
            utils1.netIncome.value = utils1.empty;
            utils1.inputOptions.getIndex(i).value.value = utils1.empty;
        }
    })

    // Sends a POST request to create a new SetAside Record in SQL Database
    document.getElementById('log-btn').addEventListener('click', async () => {
        try {
            const finalResults = utils2.getFinalNetPay();
            const arr = utils2.getSetAsides();
            const response = await createLog(arr, finalResults);
            return response;
        }
        catch (error) {
            console.log(error);
        }
    })
}


// Delete SetAside Inputs and their eventlisteners
export function listenForDeleteSetAside(deleteBtn) {
    deleteBtn.addEventListener('click', (e) => {
        for(let i = 0; i < utils1.resultContainer.children.length; i++) main.deleteSetAside(i);
    });
}


// Listeners for user input in SetAside Inputs
export function listenForUserInput(start, end) {
    utils1.netIncome.setAttribute('onkeypress', 'if(this.value.length==10) return false;')
    for(let i = start; i < end; i++) {
        utils1.inputOptions.getIndex(i).value.setAttribute('onkeypress', 'if(this.value.length==8) return false;');
        utils1.inputOptions.getIndex(i).value.addEventListener('input', main.validateSetAsides);
    }
}


// Listeners for user calculation preference change
export function listenForCalcOption(start, end) {
    for(let i = start; i < end; i++) {
        utils1.calcOption.getIndex(i).value.addEventListener('click', (e) => {
            const isForNewSetAside = main.counter - 1 < end + 1;
            if(isForNewSetAside) main.changeCalcOption(e);
            if(!(isForNewSetAside) && i < 2) main.changeCalcOption(e);
        }
    )}
}