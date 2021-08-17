const {expect} = require("chai");
const {before} = require("mocha");
const GoRestUsersApi = require("../../src/GoRestUsersApi");
const guard = require('../../utils/guard')

describe("GoRest Users API test (/users)", () =>{
    let api;
    let unAuthenticatedApi;

    before(() => {
      api = new GoRestUsersApi();
      unAuthenticatedApi = new GoRestUsersApi();

      api.authenticate();
    })

    it("Can get a list of users (GET /users", async () => {
      const response = await api.getUsersList();
      console.log('\x1b[36m%s\x1b[0m', JSON.stringify(response, null, 2));

      expect(response.meta.pagination).to.be.an("object");
      expect(response.data, "Expected data array to have 20 results").to.be.an("array").that.has.lengthOf(20);
      expect(response.meta.pagination).to.have.property("page", 1)
    })

    it("Can create a user (POST /users", async () => {
      const userToBeCreated = {
        "name":"Tenali Ramakrishna", 
        "gender":"male",
        "email": `tenali.ramakrishna-${Math.random().toString(36).slice(2)}@15ce.com`, 
        "status":"active"};

      const response = await api.createUser(userToBeCreated);
      console.log('\x1b[36m%s\x1b[0m', JSON.stringify(response, null, 2));   
      
      expect(response.data).to.have.property("name", userToBeCreated.name);
      expect(response.data).to.have.property("gender", userToBeCreated.gender);
      expect(response.data).to.have.property("email", userToBeCreated.email);
      expect(response.data).to.have.property("status", userToBeCreated.status)
    })   

    it("Error message returned when creating a user as an authenticated user (POST /users", async () => {
      const userToBeCreated = {
        "name":"Tenali Ramakrishna", 
        "gender":"male",
        "email": `tenali.ramakrishna-${Math.random().toString(36).slice(2)}@15ce.com`, 
        "status":"active"
      }

      const err = await guard(async () => unAuthenticatedApi.createUser(userToBeCreated));
      
      console.log('\x1b[36m%s\x1b[0m', JSON.stringify(err, null, 2));   
      
      //expect(response.data).to.have.property("name", userToBeCreated.name)

      expect(err).to.have.property("statusCode", 401);
      expect(err).to.have.property("message", "401 - {\"meta\":null,\"data\":{\"message\":\"Authentication failed\"}}");
    })

    it("Can get user data by id (GET /users/123", async () => {
   
      const response = await api.getUserById(6017);
      console.log('\x1b[36m%s\x1b[0m', JSON.stringify(response, null, 2));   
      expect(response.data).to.have.property("name");
      expect(response.data).to.have.property("gender");
      expect(response.data).to.have.property("email");
      expect(response.data).to.have.property("status");
    })

    it.only("Can update a user (PATCH /users/123", async () => {  
      const userToBeUpdated = {
        "name":"Tenali Ramakrishna", 
        "gender":"male",
        "email": `tenali.ramakrishna-${Math.random().toString(36).slice(2)}@15ce.com`, 
        "status":"active"
      }
      const response = await api.updateUser(6017);
      console.log('\x1b[36m%s\x1b[0m', JSON.stringify(response, null, 2));   
      
      expect(response.data).to.have.property("name", userToBeUpdated.name);
      expect(response.data).to.have.property("gender", userToBeUpdated.gender);      
      expect(response.data).to.have.property("status", userToBeUpdated.status);
    })

    it("Can delete a user (DELETE /users/123", async () => {
   
      const response = await api.deleteUser(6017);
      console.log('\x1b[36m%s\x1b[0m', JSON.stringify(response, null, 2));    
      
    })
})

