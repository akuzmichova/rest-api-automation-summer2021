const expect = require("chai").expect;

let isPalindrome = (string) =>{
  
    if (string.toLowerCase() === string.split('').reverse().join('').toLowerCase){
      console.log(`${string} is palindrome`);     
      return string;
    } else {      
      console.log(`${string} is not a palindrome`);  
      return string;   
    }
  } 

describe("isPalindrome function tests", () => {
  it("calling isPalindrome with 'level' results in 'level'", () => {

  expect(isPalindrome('level')).to.equal('level')
  }) 
})