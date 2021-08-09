const receiptTotals = [98, 24, 53, 10, 156]

function addSalesTax (value) {
return Number((value+(value*6.625)/100).toFixed(2));
}

let resultWithTaxArray = receiptTotals.map(addSalesTax);

module.exports = { resultWithTaxArray }