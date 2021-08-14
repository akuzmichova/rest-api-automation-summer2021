function addSalesTax (value) {
return Number((value*1.06625).toFixed(2));
}

const addTax = (receiptTotals) => {
    return receiptTotals.map(addSalesTax)
}

/*
OR 
const addTax = (receiptTotals) => {
    return receiptTotals.map((value) => Number((value*1.06625).toFixed(2)));
}
*/

module.exports = { addTax }