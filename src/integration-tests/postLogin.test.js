const { MongoClient } = require('mongodb');
const chai = require('chai');
const sinon = require('sinon');

const { getMockConnection } = require("./connectionMock");
const server = require('../api/app');
const { newUser, loginWithoutEmail, loginWithoutPassW, incorretLogin, correctLogin } = require('./helpersObjects');
const { status, loginMessages } = require('../messages');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const { expect } = chai;

describe.only('Valida a rota post /login', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getMockConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

    describe('Valida se o email e password são obrigatórios', () => {
      let response;

      before(async () => {
        response = await chai.request(server).post('/login').send({});
      })

      it('verifica se retorna status "401", e mensagem correspondente', (done) => {
        expect(response).to.have.status(401);
        done();
      });
      it('verifica se "message" corresponde a "All fields must be filled"', (done) => {
        expect(response.body.message).to.be.equals(loginMessages.invalidData);
        done();
      });
    });
    describe('Valida o campo email', () => {
      let response;
  
      before(async () => {
        const usersCollection = connectionMock.db('Cookmaster').collection('users');
        await usersCollection.insertOne(newUser);
  
        response = await chai.request(server).post('/login').send(loginWithoutEmail);
      });
  
      after(async () => {
        const usersCollection = connectionMock.db('Cookmaster').collection('users');
        await usersCollection.deleteOne({
          email: 'hhackenhaar@gmail.com'
        });
      })

      it('Retorna status 401 se o body não possui email', (done) => {
        expect(response).to.have.status(status.unauth);
        done();
      });
      it('Retorna propriedade message com mensagem ""Incorrect username or password"', (done) => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal(loginMessages.invalidData);
        done();
      });
    });
    describe('Valida o campo password', () => {
      let response;
  
      before(async () => {
        const usersCollection = connectionMock.db('Cookmaster').collection('users');
        await usersCollection.insertOne(newUser);
  
        response = await chai.request(server).post('/login').send(loginWithoutPassW);
      });
  
      after(async () => {
        const usersCollection = connectionMock.db('Cookmaster').collection('users');
        await usersCollection.deleteOne({
          email: 'hhackenhaar@gmail.com'
        });
      })

      it('Retorna status 401 se o body não possui password', (done) => {
        expect(response).to.have.status(status.unauth);
        done();
      });
      it('Retorna propriedade message com mensagem ""Incorrect username or password"', (done) => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal(loginMessages.invalidData);
        done();
      });
    });
    describe('Verifica se o login corresponde ao banco de dados', () => {
      let response;
  
      before(async () => {
        const usersCollection = connectionMock.db('Cookmaster').collection('users');
        await usersCollection.insertOne(newUser);
  
        response = await chai.request(server).post('/login').send(incorretLogin);
      });
  
      after(async () => {
        const usersCollection = connectionMock.db('Cookmaster').collection('users');
        await usersCollection.deleteOne({
          email: 'hhackenhaar@gmail.com'
        });
      })
      it('Retorna status 401, se login não corresponde', (done) => {
        expect(response).to.have.status(status.unauth);
        done();
      });
      it('Retorna propriedade message com mensagem "Incorrect username or password"', (done) => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal(loginMessages.incorretLogin);
        done();
      });
    });
    describe('Login realizado com sucesso', () => {
      let response;

      before(async () => {
        const usersCollection = connectionMock.db('Cookmaster').collection('users');
        await usersCollection.insertOne(newUser);
  
        response = await chai.request(server).post('/login').send(correctLogin);
      });
  
      after(async () => {
        const usersCollection = connectionMock.db('Cookmaster').collection('users');
        await usersCollection.deleteOne({
          email: 'hhackenhaar@gmail.com'
        });
      })

      it('Espera que o status do login realizado seja 200', (done) => {
        expect(response).to.have.status(status.sucess);
        done();
      });
      it('Espera que o retorno em body seja um objeto com a propriedade "token"',  (done) => {
        expect(response.body).to.have.property('token');
        expect(response.body['token']).to.be.a('string');
        done();
      });
    });  
});
