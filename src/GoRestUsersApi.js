const request = require("request-promise");

const GOREST_HOST = "https://gorest.co.in";
const publicPrefix = '/public/v1';
const GOREST_APIKEY = "cff60f4830111a45ffa352fbc2aae7cdc4b27ca0911a795372ee9cd2ca6f09bf";

class UsersApi {
    constructor(host = GOREST_HOST) {
      this.host = host;
      this.request = request.defaults({
        headers: {
            "Content-Type": "application/json", 
            "Accept":"application/json"                                  
        },
        json: true        
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

  deleteUser(userId) {
    const path = `/${publicPrefix}/users/${userId}`;

    return this.request.delete({
        url: `${this.host}${path}`       
      })
  }

  updateUser(userId) {
    const path = `/${publicPrefix}/users/${userId}`;

    return this.request.patch({
        url: `${this.host}${path}`       
      })
  }

  getUserById(userId) {
    const path = `/${publicPrefix}/users/${userId}`;

    return this.request.get({
        url: `${this.host}${path}`,         
      })
  }

  createUser(userObject) {
    const path = `/${publicPrefix}/users`;

    return this.request.post({
        url: `${this.host}${path}`,
        body: userObject
      })
  }

  getUsersList() {
    const path = `/${publicPrefix}/users`

    return this.request.get({
        url: `${this.host}${path}`
      })
  }
}

module.exports = UsersApi;