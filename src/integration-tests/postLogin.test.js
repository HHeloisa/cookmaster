const { MongoClient } = require('mongodb');
const chai = require('chai');
const sinon = require('sinon');

const { getMockConnection } = require("./connectionMock");
const server = require('../api/app');
const { loginMessages } = require('../messages');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const { expect } = chai;

const userMock = {
  name: 'Heloísa J. Hackenahar',
  email: 'hhackenhaar@gmail.com',
  password: '444648'
}

describe.only('Valida a criação de um usuário em post /login', () => {
  
  describe('Login realizado com sucesso', () => {
    let response;

    before(async () => {
      const connectionMock = await getMockConnection();
      sinon.stub(MongoClient, 'connect')
      .resolves(connectionMock);

      // cria um usuario, para depois efetuar login
      await connectionMock.db('Cookmaster').collection('users').insertOne(userMock);
    });

    after(async () => {
      MongoClient.connect.restore();
    });

    it('Espera que o retorno em body seja um objeto com a propriedade "token"', async () => {
      response = await chai.request(server)
      .post('/login')
      .send({ email: 'hhackenhaar@gmail.com', password: '444648' });

      expect(response.body).to.have.property('token');
      expect(response.body['token']).to.be.a('string');
      ;
    });
    it('Espera que o status do login realizado seja 200', async () => {
      response = await chai.request(server)
      .post('/login')
      .send({ email: 'hhackenhaar@gmail.com', password: '444648' });

      expect(response).to.have.status(200);
    });
  });
  describe('Erro ao efetuar login', () => {
    it('Retorna mensagem de erro e status 401 se o body não possui email', async () => {
      response = await chai.request(server)
      .post('/login')
      .send({ password: '444648' });

      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal(loginMessages.invalidData);
      expect(response).to.have.status(401);
    });
    it('Retorna mensagem de erro e status 401 se o body não possui password', async () => {
      response = await chai.request(server)
      .post('/login')
      .send({ email: 'hhackenhaar@gmail.com', password: '444648' });

      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal(loginMessages.invalidData);
      expect(response).to.have.status(401);
    });
     /* it('Retorna mensagem de erro se o usuario não existe', async () => {});
    it('Retorna mensagem de erro se o a senha não corresponde a do banco de dados', async () => {}); */
  })
});
