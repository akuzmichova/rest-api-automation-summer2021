const expect = require("chai").expect;

const resultWithTaxArray = require('./src/taxCalculation').resultWithTaxArray

expectedArrayWithTax = [
  104.49,
  25.59,
  56.51,
  10.66,
  166.34
]

describe("addSalesTax function test", () => {
  it("calling addSalesTax function with receiptTotals results in resultWithTaxArray", () => {

  expect(resultWithTaxArray).to.deep.equal(expectedArrayWithTax)
  }) 
})