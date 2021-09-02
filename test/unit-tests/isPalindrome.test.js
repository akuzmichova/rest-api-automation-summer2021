const { expect } = require('chai');

const isPalindrome = (string) => {
  if (string.toLowerCase() === string.split('').reverse().join('').toLowerCase) {
    console.log(`${string} is palindrome`);
    return string;
  }
  console.log(`${string} is not a palindrome`);
  return string;
};

describe('isPalindrome function tests', () => {
  it("calling isPalindrome with 'level' results in 'level'", () => {
    expect(isPalindrome('level')).to.equal('level');
  });
});
