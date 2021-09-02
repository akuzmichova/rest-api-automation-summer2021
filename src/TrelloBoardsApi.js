require('dotenv').config();
const request = require('request-promise');

const publicPrefix = '/1/boards/';
const { TRELLO_APIKEY, TRELLO_TOKEN, TRELLO_HOST } = process.env;

const defaultAuthParams = {
  key: TRELLO_APIKEY,
  token: TRELLO_TOKEN,
};

class TrelloBoardsApi {
  constructor(host = TRELLO_HOST) {
    this.host = host;
    this.request = request.defaults({
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      json: true,
    });
  }

  authenticate(apikey = TRELLO_APIKEY, token = TRELLO_TOKEN) {
    this.request = request.defaults({
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      qs: {
        key: `${apikey}`,
        token: `${token}`,
      },
      json: true,
    });
  }

  deleteBoard(boardId, resolveWithFullResponse = false) {
    const path = `${publicPrefix}${boardId}`;

    return this.request.delete({
      url: `${this.host}${path}`,
      qs: defaultAuthParams,
      resolveWithFullResponse,
    });
  }

  updateBoard(boardId, body) {
    const path = `${publicPrefix}${boardId}`;

    return this.request.put({
      url: `${this.host}${path}`,
      qs: defaultAuthParams,
      body,
    });
  }

  getBoardById(boardId) {
    const path = `${publicPrefix}${boardId}`;

    return this.request.get({
      url: `${this.host}${path}`,
      qs: defaultAuthParams,
    });
  }

  createBoard(body) {
    const path = `${publicPrefix}`;

    return this.request.post({
      url: `${this.host}${path}`,
      qs: defaultAuthParams,
      body,
    });
  }

  getUserBoardsList(userId = 'me') {
    const path = `/1/members/${userId}/boards`;

    return this.request.get({
      url: `${this.host}${path}`,
      qs: defaultAuthParams,
    });
  }
}

module.exports = TrelloBoardsApi;
