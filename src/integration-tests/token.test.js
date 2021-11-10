const { MongoClient } = require('mongodb');
const chai = require('chai');
const sinon = require('sinon');

const { getMockConnection } = require("./connectionMock");
const server = require('../api/app');
const { status, authMessages } = require('../messages');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const { expect } = chai;

const userMock = {
  name: 'Heloísa J. Hackenahar',
  email: 'hhackenhaar@gmail.com',
  password: '444648'
}

describe('Sem token de autenticação, não é possível acessar rotas', () => {
  describe('Testa rota que não requer :id', () => {
    let response;
    
    before(async () => {
      const connectionMock = await getMockConnection();
      sinon.stub(MongoClient, 'connect')
      .resolves(connectionMock);
      
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne(userMock);
    });
    after(async () => {
      MongoClient.connect.restore();
    });
    it('Não é possível acessar a rota POST /recipes sem token', async () => {
      response = await chai.request(server)
      .post('/recipes')
      .send({
        ingredients: 'Panequeca, Brocolis, Alho, FakeCheddar',
        preparation: '2 horas'
      });
      expect(response).to.have.status(status.unauth);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal(authMessages.missingToken);
    });
  })
  describe('Testas rotas que precisam de /:id', () => {
      
    before(async () => {
      const connectionMock = await getMockConnection();
      sinon.stub(MongoClient, 'connect')
      .resolves(connectionMock);
      
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne(userMock);
    });
    after(async () => {
      MongoClient.connect.restore();
    });

    it('Não é possível acessar a rota PUT /recipes sem token', async () => {
      const token = await chai.request(server)
      .post('/login')
      .send({
        email: 'hhackenhaar@gmail.com',
        password: '444648'
      })
      .then((res) => res.body.token);
    
      const recipeId = await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send({
        name: 'Lasanha vegana',
        ingredients: 'Panequeca, Brocolis, Alho, FakeCheddar',
        preparation: '2 horas'
      })
      .then((res) => res.body.recipe._id);

      response = await chai.request(server)
      .put(`/recipes/${recipeId}`)
      .send({
        name: 'Lasanha vegana deliciosa',
        ingredients: 'Panequeca, Brocolis, Alho, FakeCheddar, queijo de mandioca',
        preparation: '3 horas'
      });
      expect(response).to.have.status(status.unauth);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal(authMessages.missingToken);
    });
    it('Não é possível acessar a rota DELETE /recipes sem token', async () => {
      const token = await chai.request(server)
      .post('/login')
      .send({
        email: 'hhackenhaar@gmail.com',
        password: '444648'
      })
      .then((res) => res.body.token);
    
      const recipeId = await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send({
        name: 'Lasanha vegana',
        ingredients: 'Panequeca, Brocolis, Alho, FakeCheddar',
        preparation: '2 horas'
      })
      .then((res) => res.body.recipe._id);

      response = await chai.request(server)
      .delete(`/recipes/${recipeId}`)

      expect(response).to.have.status(status.unauth);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal(authMessages.missingToken);
    });
  })
});