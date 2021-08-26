require('dotenv').config();
const request = require("request-promise");

const publicPrefix = '/public/v1';
const { GOREST_APIKEY, GOREST_HOST } = process.env;
//const GOREST_HOST = "https://gorest.co.in";
//const GOREST_APIKEY = "cff60f4830111a45ffa352fbc2aae7cdc4b27ca0911a795372ee9cd2ca6f09bf";
//const GOREST_APIKEY = process.env.GOREST_APIKEY;
//const GOREST_HOST = process.env.GOREST_HOST;

class UsersApi {
    constructor(host = GOREST_HOST) {
      this.host = host;
      this.request = request.defaults({
        headers: {
            "Content-Type": "application/json", 
            "Accept":"application/json"                                  
        },
        json: true,
        // followAllRedirects: true     
      })
    }
  
  authenticate(apikey = GOREST_APIKEY) {
    this.request = request.defaults({
      headers: {
          "Content-Type": "application/json", 
          "Accept":"application/json",  
          "Authorization":`Bearer ${apikey}`                     
      },
      json: true        
    })
  }

  /*async authenticate1(userCredentials) {
    // call POST / authenticate to get the token
    const token = await this.getAuthToken(userCredentials);

    this.request = request.defaults({
      headers: {
          "Content-Type": "application/json", 
          "Accept":"application/json",  
          "Authorization":`Bearer ${token}`                     
      },
      json: true        
    })
  }

  getAuthToken(userCreds) {
    return this.request.post({
      url: `${this.host}/getToken`,
      body: userCreds
    })
  }  
*/
  deleteUser(userId, resolveWithFullResponse = false) {
    const path = `${publicPrefix}/users/${userId}`;

    return this.request.delete({
        url: `${this.host}${path}`,
        resolveWithFullResponse: resolveWithFullResponse      
      })
  }

  updateUser(userId, userObject) {
    const path = `${publicPrefix}/users/${userId}`;

    return this.request.put({
        // followRedirect: false,
        url: `${this.host}${path}`,
        body: userObject       
      })
  }

  getUserById(userId) {
    const path = `${publicPrefix}/users/${userId}`;

    return this.request.get({
        url: `${this.host}${path}`          
      })
  }

  createUser(userObject) {
    const path = `${publicPrefix}/users`;

    return this.request.post({
        url: `${this.host}${path}`,
        body: userObject
      })
  }

  getUsersList(queryStrings = {}) {
    const path = `${publicPrefix}/users`

    return this.request.get({
        url: `${this.host}${path}`,
        qs: queryStrings
      })
  }
}

module.exports = UsersApi;