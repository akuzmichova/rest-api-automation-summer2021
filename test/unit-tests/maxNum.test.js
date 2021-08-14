const expect = require("chai").expect;

function maxNum(maxNum){
	const theArray = [];
	for (let i = 1, k = 0 ; i < maxNum+1; i++, k++){
		if (i % 3 == 0 || i % 5 == 0){
			theArray[k] = '';
			if (i % 3 == 0 ){
				theArray[k] = 'Fizz';
			}
			if (i % 5 == 0){
				theArray[k] += 'Buzz';
			}			
		} else {
			theArray[k] = i;
		}	
	}
	return theArray;
}
console.log(maxNum(15));

expectedArray = [
    1,
    2,
    "Fizz",
    4,
    "Buzz",
    "Fizz",
    7,
    8,
    "Fizz",
    "Buzz",
    11,
    "Fizz",
    13,
    14,
    "FizzBuzz"
  ]
  console.log(expectedArray);

describe("maxNum function tests", () => {
  it("calling maxNum with 'maxNum(15)' results in 'expectedArray'", () => {

  expect(maxNum(15)).to.deep.equal(expectedArray)
  }) 
})