let toppingsList = [
    "Cheese",
    "Pepperoni",
    "Tomatoes"   
  ];

function makePizza(toppingsList) {

const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(`Here is your pizza with the toppings ${toppingsList[0]}, ${toppingsList[1]}, ${toppingsList[2]} and it took ` + (1+0.5*toppingsList.length) + ' seconds to bake it.')
    }, 1000+500*toppingsList.length);                
      });       
      
  myPromise.then((data) => {
    console.log(data)
  });  
  
  return myPromise;
  }
  
  makePizza(toppingsList);

module.exports = { makePizza }