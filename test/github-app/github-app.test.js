const {expect} = require("chai");
const {before} = require("mocha");
const GithubApi = require("../../src/GithubApi")

describe.only("Github API tests", () => {
  let githubApi;

  before(() => {
    githubApi = new GithubApi();
  })

  it.only("Can get Github user profile information", async function() {
    const response = await githubApi.getUserByName("akuzmichova");
    console.log(response)
    expect(response.login).to.equal("akuzmichova")  
  })

  it.only("Can get Github user profile information", async function() {
    const response = await githubApi.getUserByName("akuzmichova");
    console.log(response)    
    expect(response.public_repos).to.equal(4)
  })

  it.only("Can get Github user profile information", async function() {
      const response = await githubApi.getUserByName("akuzmichova");
      console.log(response)    
      expect(response.followers).to.equal(1)
  })
})
