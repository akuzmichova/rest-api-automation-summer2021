const expect = require("chai").expect;

let fahrenheitToCelsius = (tempF) => {
  const inputType = typeof tempF 

  if (inputType !== "number") {
  console.log("I can only convert number, but I got ${inputType}")

  return;
  }

let tempC = Math.round((tempF - 32) * 5 / 9);
  console.log(`${tempF}°F is ${tempC}°C.`);
  
  return tempC;
  };  

describe("fahrenheitToCelsius function tests", () => {
  it("calling fahrenheitToCelsius with 77 results in 25", () => {

  expect(fahrenheitToCelsius(77)).to.equal(25)
  }) 

  it("calling fahrenheitToCelsius with 0 results in -18", () => {

  expect(fahrenheitToCelsius(0)).to.equal(-18)
  }) 
})