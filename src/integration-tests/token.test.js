const { MongoClient } = require('mongodb');
const chai = require('chai');
const sinon = require('sinon');
const { getMockConnection } = require("./connectionMock");
const server = require('../api/app');
const { newUser, correctLogin, recipe } = require('./helpersObjects');
const { status, authMessages } = require('../messages');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;

describe('Sem token de autenticação, não é possível acessar rotas', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getMockConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });
  after(() => {
    MongoClient.connect.restore();
  });

  describe('Não é possível acessar a rota POST /recipes sem token', () => {
    let response;
    
    before(async () => {      
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne(newUser);

      response = await chai.request(server).post('/recipes').send(recipe);
    });
    after(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.deleteOne({
        email: 'hhackenhaar@gmail.com'
      });
    });
   
    it('Sem token, retorna status 401', (done) => {
      expect(response).to.have.status(status.unauth);
      done();
    });
    it('Sem token, retorna propriedade message com valor "missing auth token"', (done) => {
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal(authMessages.missingToken);
      done();
    })
  })

  describe('Não é possível acessar a rota PUT /recipes sem token', () => {
    let response;
    before(async () => {  
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne(newUser);
      const { body: { token } } = await chai.request(server).post('/login').send(correctLogin);
      const { body: { recipe: _id } } = await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send(recipe)

      response = await chai.request(server)
      .put(`/recipes/${ _id }`)
      .send({
        name: 'Lasanha vegana deliciosa',
        ingredients: 'Panequeca, Brocolis, Alho, FakeCheddar, queijo de mandioca',
        preparation: '3 horas'
      });
    });
    after(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.deleteOne({
        email: 'hhackenhaar@gmail.com'
      });
    });
    it('Sem token, retorna status 401', (done) => {
      expect(response).to.have.status(status.unauth);
      done()
    });
    it('Sem token, retorna propriedade message com valor "missing auth token"', (done) => {
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal(authMessages.missingToken);
      done();
    });
  });
  
  
  describe('Não é possível acessar a rota DELETE /recipes sem token', () => {
    let response;
    before(async () => {  
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne(newUser);
      const { body: { token } } = await chai.request(server).post('/login').send(correctLogin);
      const { body: { recipe: _id } } = await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send(recipe)

      response = await chai.request(server)
      .delete(`/recipes/${ _id }`);
    });
    after(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.deleteOne({
        email: 'hhackenhaar@gmail.com'
      });
    });
    it('Sem token, retorna status 401', (done) => {
    expect(response).to.have.status(status.unauth);
    done();
    });
    it('Sem token, retorna propriedade message com valor "missing auth token"', (done) => {
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.be.equal(authMessages.missingToken);
    done();
    });
  });
});