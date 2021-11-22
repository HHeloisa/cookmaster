const { MongoClient } = require('mongodb');
const chai = require('chai');
const sinon = require('sinon');
const { getMockConnection } = require("./connectionMock");
const server = require('../api/app');
const { recipe, correctLogin, newUser, otherUser, otherUserLogin } = require('./helpersObjects');
const { status, usersMessages } = require('../messages');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { expect } = chai;

describe('Valida a função AdminOrOwner, nas rotas PUT, PUT/image e DELETE ', () => {
    let connectionMock;
  
    before(async () => {
      connectionMock = await getMockConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne(newUser);
      const { body: { token } } = await chai.request(server).post('/login').send(correctLogin);
      const { body: { recipe: _id } } = await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send(recipe);

      await usersCollection.insertOne(otherUser);
    });
  
    after(async() => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.deleteMany({});
      MongoClient.connect.restore();
    });

  describe('Se não é admin, nem proprietario, não acessa a rota PUT/recipes', () => {
    let response;
    before(async () => {
      const { body: { token } } = await chai.request(server).post('/login').send(otherUserLogin);
      const { body: array } = await chai.request(server).get('/recipes');
      const { _id } = array[0];
      
      response = await chai.request(server)
      .put(`/recipes/${ _id }`)
      .set('Authorization', token)
      .send(recipe);
    });
    it('Retorna status 401', () => {
      expect(response).to.have.status(status.forbidden);
    });
    it('Retorna propriedade message com valor correspondente.', (done) => {
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal(usersMessages.onlyAdmin);
      done();
    });
  });
  describe('Se não é admin, nem proprietario, não acessa a rota DELETE/recipes', () => {
    let response;
    before(async () => {
      const { body: { token } } = await chai.request(server).post('/login').send(otherUserLogin);
      const { body: array } = await chai.request(server).get('/recipes');
      const { _id } = array[0];
      
      response = await chai.request(server)
      .delete(`/recipes/${ _id }`)
      .set('Authorization', token);
    });
    it('Retorna status 401', () => {
      expect(response).to.have.status(status.forbidden);
    });
    it('Retorna propriedade message com valor correspondente.', (done) => {
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal(usersMessages.onlyAdmin);
      done();
    });
  });
  describe('Se não é admin, nem proprietario, não acessa a rota PUT/recipes', () => {
    let response;
    before(async () => {
      const { body: { token } } = await chai.request(server).post('/login').send(otherUserLogin);
      const { body: array } = await chai.request(server).get('/recipes');
      const { _id } = array[0];
      
      response = await chai.request(server)
      .put(`/recipes/${ _id }/image/`)
      .set('Authorization', token)
    });
    it('Retorna status 401', () => {
      expect(response).to.have.status(status.forbidden);
    });
    it('Retorna propriedade message com valor correspondente.', (done) => {
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal(usersMessages.onlyAdmin);
      done();
    });
  });
});
