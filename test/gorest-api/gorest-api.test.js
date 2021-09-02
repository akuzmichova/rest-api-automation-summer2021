const {expect, use} = require("chai");
const {before} = require("mocha");
const GoRestUsersApi = require("../../src/GoRestUsersApi");
const guard = require('../../utils/guard')
const factory = require('../../src/factory/usersApi-factory')
const wait = require('../../utils/wait')

describe("GoRest Users API tests (/users)", () =>{
    let api;
    let unAuthenticatedApi;
  
    before(() => {
      api = new GoRestUsersApi();
      unAuthenticatedApi = new GoRestUsersApi();

      api.authenticate();
      /*api.authenticate({username: "Test", password: "12345"
      });*/

      const {data: usersToBeDeleted } = await api.getUsersList({ email: factory.qaPrefix})
      
      await Promise.all(usersToBeDeleted.map(user => {
        api.deleteUser(user.data.id)
      }))  
    })

    afterEach(async () => {
      const {data: usersToBeDeleted } = await api.getUsersList({ email: factory.qaPrefix})
      
      await Promise.all(usersToBeDeleted.map(user => {
        api.deleteUser(user.data.id)
      }))   
    })      

  describe("GoRest Users API miscellaneous tests", () => {
      it.only("Error message returned when creating a user as an authenticated user (POST /users)", async () => {
        //const userToBeCreated = factory.user();
        
        const err = await guard(async () => unAuthenticatedApi.createUser(factory.user()));
              
        expect(err).to.have.property("statusCode", 401);
        expect(err).to.be.an.instanceOf(Error);
        expect(err).to.have.property("message", "401 - {\"meta\":null,\"data\":{\"message\":\"Authentication failed\"}}");
      })

      it("Error returned when creating a user and required user properties are missing from the request (POST /public/v1/users)", async () => {
        const userToBeCreated = {
          "name":"Tenali Ramakrishna", 
          "gender":"male",
          "email": `tenali.ramakrishna-${Math.random().toString(36).slice(2)}@15ce.com`        
        }

        const err = await guard(async () => api.createUser(userToBeCreated));        
        
        expect(err).to.be.an.instanceOf(Error);
        expect(err).to.have.property("statusCode", 422);
        expect(err).to.have.property("message", "422 - {\"meta\":null,\"data\":[{\"field\":\"status\",\"message\":\"can't be blank\"}]}");
      })

      it("Error returned when creating a user and all required user properties are missing from the request (POST /public/v1/users)", async () => {
        const userToBeCreated = {               
        }

        const err = await guard(async () => api.createUser(userToBeCreated));        
        
        expect(err).to.be.an.instanceOf(Error);
        expect(err).to.have.property("statusCode", 422);
        expect(err).to.have.property("message", "422 - {\"meta\":null,\"data\":[{\"field\":\"email\",\"message\":\"can't be blank\"},{\"field\":\"name\",\"message\":\"can't be blank\"},{\"field\":\"gender\",\"message\":\"can't be blank\"},{\"field\":\"status\",\"message\":\"can't be blank\"}]}");
      })

      it("Error returned when getting a user that has been deleted)", async () => {
        const userCreatedResponse = await api.createUser(factory.user());
 
        const deleteResponse = await api.deleteUser(userCreatedResponse.data.id, true); 

        const err = await guard(async () => api.getUserById(userCreatedResponse.data.id));     
        
        expect(err).to.be.an.instanceOf(Error);
        expect(err).to.have.property("statusCode", 404);
        expect(err).to.have.property("message", "404 - {\"meta\":null,\"data\":{\"message\":\"Resource not found\"}}");
      })

      it("Error returned when deleting an already deleted user (DELETE /public/v1/users/:id)", async () => {
        const userCreatedResponse = await api.createUser(factory.user());
 
        const deleteResponse = await api.deleteUser(userCreatedResponse.data.id, true);          
        
        const err = await guard(async () => api.deleteUser(userCreatedResponse.data.id));    
        
        expect(err).to.be.an.instanceOf(Error);
        expect(err).to.have.property("statusCode", 404);
        expect(err).to.have.property("message", "404 - {\"meta\":null,\"data\":{\"message\":\"Resource not found\"}}");
      })
  })

  describe("GoRest Create users (POST /public/v1/users)", () => {
    it("Can create a user (POST /users)", async () => {
      const userToBeCreated = {
        "name":"Tenali Ramakrishna", 
        "gender":"male",
        "email": `tenali.ramakrishna-${Math.random().toString(36).slice(2)}@15ce.com`, 
        "status":"active"};

      const { data: createdUser } = await api.createUser(userToBeCreated);      
     
      newUser = createdUser.id;    
     
      expect(createdUser).to.have.property("name", userToBeCreated.name);     
      expect(createdUser).to.have.property("gender", userToBeCreated.gender);
      expect(createdUser).to.have.property("email", userToBeCreated.email);
      expect(createdUser).to.have.property("status", userToBeCreated.status);
      expect(createdUser).to.have.property("id").that.is.a("number")       
    })    

    it("Can create multiple users in parallel (POST /users)", async () => {
      const userToBeCreated1 = {
        ...factory.user(),
        "name": `User1 (${factory.randomString()})`, 
       }

      const userToBeCreated2 = {
        ...factory.user(),
        "name":"User2", 
      }

      const userToBeCreated3 = {
        ...factory.user(),
        "name":"User3",
       }         
    
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
    it("Can get a list of users (GET /users)", async () => {
      const userToBeCreated = {
        "name":"Tenali Ramakrishna", 
        "gender":"male",
        "email": `tenali.ramakrishna-${Math.random().toString(36).slice(2)}@15ce.com`, 
        "status":"active"};

      const userCreatedResponse = await api.createUser(userToBeCreated);

      newUser = userCreatedResponse.id; 

      const response = await api.getUsersList({
        email: userToBeCreated.email,
        name: userToBeCreated.name,
      });      
     
      expect(response.meta.pagination).to.be.an("object");
      //expect(response.data, "Expected data array to have 20 results").to.be.an("array").that.has.lengthOf(20);
      expect(response.meta.pagination).to.have.property("page", 1)
    })  

    it("Can filter a list of users by email (GET /users?name=varma)", async () => {
      
      const userCreatedResponse = await api.createUser(factory.user);

      const response = await api.getUsersList({email: userToBeCreated.email});         
    
      expect(response.meta.pagination).to.be.an("object");    
      expect(response.meta.pagination.total).to.be.equal(1); 
      expect(response.data[0].name).to.be.equal(userToBeCreated.name);   
    })  
    it("Can search for users by different user properties (GET /public/v1/users?prop=value", async () => {
      
      const userToBeCreated1 = {
        ...factory.user(),       
       }

      const userToBeCreated2 = {
        ...factory.user(),        
      }

      const userToBeCreated3 = {
        ...factory.user(),        
       }         
      
      const myUserArray = await Promise.all([
        api.createUser(userToBeCreated1),
        api.createUser(userToBeCreated2),
        api.createUser(userToBeCreated3)
      ])     
         
      const myResponseArray = await Promise.all([
        api.getUsersList({        
          name: userToBeCreated1.name,
          gender: userToBeCreated1.gender,
          email: userToBeCreated1.email,
          status: userToBeCreated1.status,
        }),    
        api.getUsersList({        
          name: userToBeCreated2.name,
          gender: userToBeCreated2.gender,
          email: userToBeCreated2.email,
         status: userToBeCreated2.status,
        }),
        api.getUsersList({        
          name: userToBeCreated3.name,
          gender: userToBeCreated3.gender,
          email: userToBeCreated3.email,
          status: userToBeCreated3.status,
        })
      ])       
     
      for (i = 0; i < myResponseArray.length; i++) {
        expect(myResponseArray[i].data[0].name).to.be.equal(myUserArray[i].data.name); 
        expect(myResponseArray[i].data[0].email).to.be.equal(myUserArray[i].data.email);  
        expect(myResponseArray[i].data[0].status).to.be.equal(myUserArray[i].data.status);  
        expect(myResponseArray[i].data[0].gender).to.be.equal(myUserArray[i].data.gender);  
      }           
      expect(myResponseArray.length).to.be.equal(3);   
    })    
  })  
  
  describe("GoRest Update users (PUT /public/v1/users/{:id})", () => {  
    it("Can update user by ID (slow) (PUT /users/{:id})", async () => {  
    // create a user
    const userToBeCreated = factory.user();
    const userCreatedResponse = await api.createUser(userToBeCreated);
    
    // Wait 5 seconds here
    await wait(5000);

    // prepare updated body
    const userToBeUpdated = {
      "name":"John Doe", 
      "gender":"female",
      "email": `tenali.ramakrishna-${Math.random().toString(36).slice(2)}@15ce.com`, 
      "status":"inactive"};
    
      const { data: updatedUser }  = await api.updateUser(userCreatedResponse.data.id, userToBeUpdated);   
      
      const expectedUserUpdated = {
        ...userToBeUpdated,
        updated_at: factory.today,
        updated_by: "admin"
      }

      expect(updatedUser).to.deep.equal(expectedUserUpdated)
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
    it("Can delete user by ID (DELETE /users/{:id})", async () => {
       
      const userCreatedResponse = await api.createUser(factory.user());
 
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

      newUser = userCreatedResponse.id; 
       
      expect(gottenByIdUser).to.have.property("name", userToBeCreated.name);
      expect(gottenByIdUser).to.have.property("gender",userToBeCreated.gender);
      expect(gottenByIdUser).to.have.property("email", userToBeCreated.email);
      expect(gottenByIdUser).to.have.property("status", userToBeCreated.status);
      expect(gottenByIdUser).to.have.property("id").that.is.a("number")    
    })
  }) 
})

