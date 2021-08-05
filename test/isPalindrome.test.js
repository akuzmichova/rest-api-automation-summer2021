const expect = require("chai").expect;

let isPalindrome = (string) =>{
  
    if (string.toLowerCase === string.split('').reverse().join('').toLowerCase){
      return string;
      console.log(`${string} is palindrome`);     
    } else {
      return string;
      console.log(`${string} is not a palindrome`);     
    }
  } 

describe("isPalindrome function tests", () => {
  it("calling isPalindrome with 'level' results in 'level'", () => {

  expect(isPalindrome('level')).to.equal('level')
  }) 

  it("calling isPalindrome with 'Bob' results in 'bob'", () => {

  expect(isPalindrome('Bob')).to.equal('bob')
  }) 

})