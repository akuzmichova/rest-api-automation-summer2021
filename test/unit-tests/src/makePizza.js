function makePizza(toppingsList) {

const myPromise = new Promise((resolve, reject) => {
  let bakeTime = 1000+500*toppingsList.length;
  setTimeout(() => {
    resolve(`Here is your pizza with the toppings ${toppingsList.join(", ")} and it took ${bakeTime/1000} seconds to bake it.`)
    }, bakeTime);                
      });      
       
  return myPromise;
  }  

module.exports = { makePizza }