const {expect, use} = require("chai");
const {before} = require("mocha");
const GoRestUsersApi = require("../../src/GoRestUsersApi");
const guard = require('../../utils/guard')

describe("GoRest Users API tests (/users)", () =>{
    let api;
    let unAuthenticatedApi;

    before(() => {
      api = new GoRestUsersApi();
      unAuthenticatedApi = new GoRestUsersApi();

      api.authenticate();
      /*api.authenticate({username: "Test", password: "12345"
      });*/
    })

  describe("GoRest Users API miscellaneous tests", () => {
      it("Error message returned when creating a user as an authenticated user (POST /users", async () => {
        const userToBeCreated = {
          "name":"Tenali Ramakrishna", 
          "gender":"male",
          "email": `tenali.ramakrishna-${Math.random().toString(36).slice(2)}@15ce.com`, 
          "status":"active"
        }
  
        const err = await guard(async () => unAuthenticatedApi.createUser(userToBeCreated));
              
        expect(err).to.have.property("statusCode", 401);
        expect(err).to.be.an.instanceOf(Error);
        expect(err).to.have.property("message", "401 - {\"meta\":null,\"data\":{\"message\":\"Authentication failed\"}}");
      })

      it("Error returned when creating a user and required user properties are missing from the request (POST /public/v1/users", async () => {
        const userToBeCreated = {
          "name":"Tenali Ramakrishna", 
          "gender":"male",
          "email": `tenali.ramakrishna-${Math.random().toString(36).slice(2)}@15ce.com`        
        }

        const err1 = await guard(async () => api.createUser(userToBeCreated));        
        
        expect(err1).to.have.property("statusCode", 422);
        expect(err1).to.be.an.instanceOf(Error);
        expect(err1).to.have.property("message", "422 - {\"meta\":null,\"data\":[{\"field\":\"status\",\"message\":\"can't be blank\"}]}");
      })
  })

  describe("GoRest Create users (POST /public/v1/users)", () => {
    it("Can create a user (POST /users", async () => {
      const userToBeCreated = {
        "name":"Tenali Ramakrishna", 
        "gender":"male",
        "email": `tenali.ramakrishna-${Math.random().toString(36).slice(2)}@15ce.com`, 
        "status":"active"};

      const { data: createdUser } = await api.createUser(userToBeCreated);
           
      expect(createdUser).to.have.property("name", userToBeCreated.name);     
      expect(createdUser).to.have.property("gender", userToBeCreated.gender);
      expect(createdUser).to.have.property("email", userToBeCreated.email);
      expect(createdUser).to.have.property("status", userToBeCreated.status);
      expect(createdUser).to.have.property("id").that.is.a("number")       
    })    

    it("Can create multiple users in parallel (POST /users", async () => {
      const userToBeCreated1 = {
        "name":"User1", 
        "gender":"male",
        "email": `tenali.ramakrishna-${Math.random().toString(36).slice(2)}@15ce.com`, 
        "status":"active"};

      const userToBeCreated2 = {
        "name":"User2", 
        "gender":"male",
        "email": `tenali.ramakrishna-${Math.random().toString(36).slice(2)}@15ce.com`, 
        "status":"active"};

      const userToBeCreated3 = {
        "name":"User3", 
        "gender":"male",
        "email": `tenali.ramakrishna-${Math.random().toString(36).slice(2)}@15ce.com`, 
        "status":"active"};
         

      const myUserArray = await Promise.all([
        api.createUser(userToBeCreated1),
        api.createUser(userToBeCreated2),
        api.createUser(userToBeCreated3)
      ])
      
      myUserArray.forEach((user) => {
        expect(user.data).to.have.property("email").that.is.a("string")
      })   
    })   
  })

  describe("GoRest Get users list (GET /users)", () => {
    it("Can get a list of users (GET /users", async () => {
      const response = await api.getUsersList();      

      expect(response.meta.pagination).to.be.an("object");
      expect(response.data, "Expected data array to have 20 results").to.be.an("array").that.has.lengthOf(20);
      expect(response.meta.pagination).to.have.property("page", 1)
    })  

    it("Can filter a list of users by email (GET /users?name=varma", async () => {
      const userToBeCreated = {
        "name":"Tenali Ramakrishna", 
        "gender":"male",
        "email": `tenali.ramakrishna-${Math.random().toString(36).slice(2)}@15ce.com`, 
        "status":"active"};    
  
      const userCreatedResponse = await api.createUser(userToBeCreated);

      const response = await api.getUsersList({email: userToBeCreated.email});   
      expect(response.meta.pagination).to.be.an("object");     
    })  
  })  
  
  describe("GoRest Update users (PUT /public/v1/users/{:id})", () => {  
    it("Can update user by ID (PUT /users/{:id})", async () => {  
    // create a user
    const userToBeCreated = {
      "name":"Tenali Ramakrishna", 
      "gender":"male",
      "email": `tenali.ramakrishna-${Math.random().toString(36).slice(2)}@15ce.com`, 
      "status":"active"};    

    const userCreatedResponse = await api.createUser(userToBeCreated);
    // prepare updated body
    const userToBeUpdated = {
      "name":"John Doe", 
      "gender":"female",
      "email": `tenali.ramakrishna-${Math.random().toString(36).slice(2)}@15ce.com`, 
      "status":"inactive"};
    
      const { data: updatedUser }  = await api.updateUser(userCreatedResponse.data.id, userToBeUpdated);
      // without using de-structuring
      // const updatedUser = (await api.updateUser(userCreatedResponse.data.id, userToBeUpdated)).data;
      // const { data } = userUpdatedResponse;      
     
      // verify      
      expect(updatedUser).to.have.property("name", userToBeUpdated.name);
      expect(updatedUser).to.have.property("gender", userToBeUpdated.gender);  
      expect(updatedUser).to.have.property("email", userToBeUpdated.email);    
      expect(updatedUser).to.have.property("status", userToBeUpdated.status);
      expect(updatedUser).to.have.property("id").that.is.a("number")  
    })
  }) 

  describe("GoRest Delete users by ID (DELETE /public/v1/users/{:id})", () => {
    it("Can delete user by ID (DELETE /users/{:id}", async () => {
      const userToBeCreated = {
        "name":"Tenali Ramakrishna", 
        "gender":"male",
        "email": `tenali.ramakrishna-${Math.random().toString(36).slice(2)}@15ce.com`, 
        "status":"active"};    
  
      const userCreatedResponse = await api.createUser(userToBeCreated);
 
      const deleteResponse = await api.deleteUser(userCreatedResponse.data.id, true);
      
      expect(deleteResponse).to.have.property("statusCode", 204)
    })
  }) 
    
  describe("GoRest Get single user by ID (GET /public/v1/users/{:id})", () => {
    it("Can get user by ID (GET /users/{:id}", async () => {
      const userToBeCreated = {
        "name":"Tenali Ramakrishna", 
        "gender":"male",
        "email": `tenali.ramakrishna-${Math.random().toString(36).slice(2)}@15ce.com`, 
        "status":"active"};    
  
      const userCreatedResponse = await api.createUser(userToBeCreated);     
        
      const { data: gottenByIdUser }  = await api.getUserById(userCreatedResponse.data.id);
       
      expect(gottenByIdUser).to.have.property("name", userToBeCreated.name);
      expect(gottenByIdUser).to.have.property("gender",userToBeCreated.gender);
      expect(gottenByIdUser).to.have.property("email", userToBeCreated.email);
      expect(gottenByIdUser).to.have.property("status", userToBeCreated.status);
      expect(gottenByIdUser).to.have.property("id").that.is.a("number")    
    })
  }) 
})

