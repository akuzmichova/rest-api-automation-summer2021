const faker = require('faker');
const moment = require('moment');

const USER_GENDERS = ['male', 'female'];
const qaPrefix = 'QATestUser';
const qaPrefixBoards = 'QATestBoard';

const randomString = (length = 8) => faker.random.alphaNumeric(length);

const today = moment().format('YYYY-MM-DD');
const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');

const user = () => {
  return {
    name: `${faker.name.findName()} ${faker.name.lastName()}`,
    gender: faker.random.arrayElement(USER_GENDERS),
    email: `${qaPrefix}-ramakrishna-${randomString()}@15ce.com`,
    status: 'active',
  };
};

const board = () => {
  return {
    name: `${qaPrefixBoards}-boardName-${randomString()}`,
  };
};

module.exports = {
  board, user, randomString, today, tomorrow, qaPrefix, qaPrefixBoards,
};
