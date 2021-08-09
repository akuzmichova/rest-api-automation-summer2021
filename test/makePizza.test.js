const expect = require("chai").expect;

const makePizza = require('./src/makePizza').makePizza

let toppingsList = [
  "Cheese",
  "Pepperoni",
  "Tomatoes"   
];


describe("makePizza function test", () => {
  it("calling makePizza function with pizzaToppings results in 'Here is your pizza with the toppings Cheese, Pepperoni, Tomatoes and it took 2.5 seconds to bake it.'", () => {

  expect('Here is your pizza with the toppings Cheese, Pepperoni, Tomatoes and it took 2.5 seconds to bake it.').to.equal(makePizza(toppingsList))
  }) 
})