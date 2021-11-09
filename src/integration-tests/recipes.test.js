const { MongoClient } = require('mongodb');
const chai = require('chai');
const sinon = require('sinon');

const { getMockConnection } = require("./connectionMock");
const server = require('../api/app');
const { recipesMessages } = require('../messages');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const { expect } = chai;

const userMock = {
  name: 'Heloísa J. Hackenahar',
  email: 'hhackenhaar@gmail.com',
  password: '444648'
}

describe.only('Testes da rota GET /recipes', () => {
  
  describe('testa caso de sucesso em buscar todas as receitas', () => {
    let response;

    before(async () => {
      const connectionMock = await getMockConnection();
      sinon.stub(MongoClient, 'connect')
      .resolves(connectionMock);

      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne(userMock);
  
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'hhackenhaar@gmail.com',
          password: '444648'
        })
        .then((res) => res.body.token);
  
      response = await chai.request(server)
        .get('/recipes')
        .set('Authorization', token);
      });

    it('retorna código de status "200"', () => {
      expect(response).to.have.status(200);
    });

    it('retorna um array no body', () => {
      expect(response.body).to.be.an('array');
    });
  });
  describe('testa caso de erro na publicação da receita', () => {});
})