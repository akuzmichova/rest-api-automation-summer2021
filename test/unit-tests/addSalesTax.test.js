const { expect } = require('chai');

const { addTax } = require('./src/taxCalculation');

describe('addSalesTax function test', () => {
  const expectedArrayWithTax = [
    104.49,
    25.59,
    56.51,
    10.66,
    166.34,
  ];

  const receiptTotals = [98, 24, 53, 10, 156];
  it('calling addSalesTax function with receiptTotals results in resultWithTaxArray', () => {
    expect(addTax(receiptTotals)).to.deep.equal(expectedArrayWithTax);
  });
});
