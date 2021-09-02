const { expect, use } = require('chai');
const TrelloBoardsApi = require('../../src/TrelloBoardsApi');
const guard = require('../../utils/guard');
const factory = require('../../src/factory/usersApi-factory');

describe('Trello Boards API tests (/1/boards/)', () => {
  let api;
  const invalidBoardId = 123456789;

  before(async () => {
    api = new TrelloBoardsApi();

    api.authenticate();

    const boardsList = await api.getUserBoardsList();

    await Promise.all(boardsList.map((board) => {
      return api.deleteBoard(board.id);
    }));
  });

  afterEach(async () => {
    const boardsList = await api.getUserBoardsList();

    await Promise.all(boardsList.map((board) => {
      return api.deleteBoard(board.id);
    }));
  });

  describe('Trello Create a board (POST /1/boards/)', () => {
    it('Can create a board (POST /boards)', async () => {
      const boardToBeCreated = {
        name: 'Test board created from API',
      };

      const boardCreatedResponse = await api.createBoard(boardToBeCreated);

      expect(boardCreatedResponse).to.have.property('id');
      expect(boardCreatedResponse).to.have.property('name', boardToBeCreated.name);
    });

    it('Error returned when creating a board and required property is missing from the request (POST /boards)', async () => {
      const err = await guard(async () => api.createBoard({}));

      expect(err).to.be.an.instanceOf(Error);
      expect(err).to.have.property('statusCode', 400);
      expect(err).to.have.property('error', 'invalid value for name');
    });
  });

  describe('Trello Get single board by ID (GET /1/boards/{:id})', () => {
    it('Can get board by ID (GET /boards/{:id}', async () => {
      const boardToBeCreated = factory.board();

      const boardCreatedResponse = await api.createBoard(boardToBeCreated);

      const gottenByIdBoardResponse = await api.getBoardById(boardCreatedResponse.id);

      expect(gottenByIdBoardResponse).to.have.property('name', boardToBeCreated.name);
      expect(gottenByIdBoardResponse).to.have.property('id');
      expect(gottenByIdBoardResponse).to.have.property('idOrganization');
    });

    it('Error returned when trying to get a board with invalid ID (GET /boards/{:id}', async () => {
      await api.createBoard(factory.board());

      const err = await guard(async () => api.getBoardById(invalidBoardId));

      expect(err).to.be.an.instanceOf(Error);
      expect(err).to.have.property('statusCode', 400);
      expect(err).to.have.property('error', 'invalid id');
    });
  });

  describe('Trello Update board (PUT /1/boards/{:id})', () => {
    it('Can update board by ID (PUT /boards/{:id})', async () => {
      const boardCreatedResponse = await api.createBoard(factory.board());

      const boardToBeUpdated = {
        name: 'Updated name for the board',
      };

      const updatedBoardResponse = await api.updateBoard(boardCreatedResponse.id, boardToBeUpdated);

      expect(updatedBoardResponse).to.have.property('name', boardToBeUpdated.name);
      expect(updatedBoardResponse).to.have.property('id', boardCreatedResponse.id);
    });

    it('Error returned when trying to update a board with invalid ID (PUT /boards/{:id}', async () => {
      await api.createBoard(factory.board());

      const boardToBeUpdated = {
        name: 'Updated name for the board',
      };

      const err = await guard(async () => api.updateBoard(invalidBoardId, boardToBeUpdated));

      expect(err).to.be.an.instanceOf(Error);
      expect(err).to.have.property('statusCode', 400);
      expect(err).to.have.property('error', 'invalid id');
    });
  });

  describe('Trello Delete board by ID (DELETE /1/boards/{:id})', () => {
    it('Can delete board by ID (DELETE /boards/{:id})', async () => {
      const boardCreatedResponse = await api.createBoard(factory.board());

      const deletedBoardResponse = await api.deleteBoard(boardCreatedResponse.id, true);

      expect(deletedBoardResponse).to.have.property('statusCode', 200);
    });

    it('Error returned when trying to delete a board with invalid ID (DELETE /boards/{:id}', async () => {
      await api.createBoard(factory.board());

      const err = await guard(async () => api.deleteBoard(invalidBoardId));

      expect(err).to.be.an.instanceOf(Error);
      expect(err).to.have.property('statusCode', 400);
      expect(err).to.have.property('error', 'invalid id');
    });
  });
});
