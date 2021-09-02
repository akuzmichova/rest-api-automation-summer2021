const { expect } = require('chai');

const { makePizza } = require('./src/makePizza');

describe('make pizza function tests', () => {
  it('calling a make pizza with toppings results in correct string', function (done) {
    this.timeout(0);
    const toppingsList = [
      'Cheese',
      'Pepperoni',
      'Tomatoes',
    ];
    makePizza(toppingsList).then((data) => {
      console.log(data);
      expect(data).to.equal('Here is your pizza with the toppings Cheese, Pepperoni, Tomatoes and it took 2.5 seconds to bake it.');
      done();
    });
  });
});
