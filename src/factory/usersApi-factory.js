const faker = require('faker')
const moment = require('moment')

const USER_GENDERS = ["male", "female"]

const randomString = (length = 8) => faker.random.alphaNumeric(length);

const today = moment().format('YYYY-MM-DD');
const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');

const user = () => {

  return {   
    name: `${faker.name.findName()} ${faker.name.lastName()}`, 
    gender: faker.random.arrayElement(USER_GENDERS),
    email: `tenali.ramakrishna-${randomString()}@15ce.com`,
    status:"active"
  }
}

module.exports = { user, randomString, today, tomorrow }