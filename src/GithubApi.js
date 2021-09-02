const request = require('request-promise');

const githubApiHost = 'https://api.github.com';

class GithubApi {
  constructor(host = githubApiHost) {
    this.host = host;
    this.request = request.defaults(
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'akuzmichova',
        },
        json: true,
      },
    );
  }

  getUserByName(gitUserName) {
    const path = `/users/${gitUserName}`;

    return this.request.get({
      url: `${githubApiHost}${path}`,
    });
  }
}

module.exports = GithubApi;
