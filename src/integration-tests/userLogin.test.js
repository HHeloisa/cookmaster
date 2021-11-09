// Validando o cadastro de usuário 
const { MongoClient } = require('mongodb');
const chai = require('chai');
const sinon = require('sinon');

const { getMockConnection } = require("./connectionMock");
const server = require('../api/app');
const messages = require('../messages');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const { expect } = chai;

const userMock = {
  name: 'Heloísa J. Hackenahar',
  email: 'hhackenhaar@gmail.com',
  password: '444648'
}

describe('Valida a criação de um usuário em post /users', () => {

  describe('Cadastro de usuário realizado com sucesso', () => {
    let response;

    before(async () => {
      const connectionMock = await getMockConnection();
      sinon.stub(MongoClient, 'connect')
      .resolves(connectionMock);

      response = await chai.request(server)
        .post('/users')
        .send({
          "name": "Heloísa J. Hackenhaar",
          "email": "hhackenhaar@gmail.com",
          "password": "444648"
        });
    });

    after(async () => {
      MongoClient.connect.restore();
    });

    it('Espera que o retorno em body seja um objeto com a propriedade "user"', () => {
      expect(response.body).to.be.an('object')
      expect(response.body).to.be.property('user');
    });
    it('Espera que o objeto "user" tenha a propriedade "name"', () => {
      expect(response.body.user).to.be.property('name');
      expect(response.body.user['name']).to.be.a('string');
      expect(response.body.user.name).to.be.equal('Heloísa J. Hackenhaar');
    });
    it('Espera que o objeto "user" tenha a propriedade "email"', () => {
      expect(response.body.user).to.be.property('email');
      expect(response.body.user['email']).to.be.a('string');
      expect(response.body.user.email).to.be.equal('hhackenhaar@gmail.com');
    });
    it('Espera que o objeto "user" tenha a propriedade "_id"', () => {
      expect(response.body.user).to.be.property('_id');
      expect(response.body.user['_id']).to.be.a('string');
    });
    it('Espera que o objeto "user" tenha a propriedade "role"', () => {
      expect(response.body.user).to.be.property('role');
      expect(response.body.user['role']).to.be.a('string');
      expect(response.body.user.role).to.be.equal('user');
    });
    it('Espera que o status seja 201, create', () => {
      expect(response).to.have.status(201);
    });
  });

  describe('Erro no cadastro de usuário', () => {
    let response;

    before(async () => {
      const connectionMock = await getMockConnection();
      sinon.stub(MongoClient, 'connect')
      .resolves(connectionMock);

      // cria um usuario agora, para testar depois o que retorna ao criar um usuario que já existe.
      connectionMock.db('Cookmater').collection('users').insertOne(userMock);
    });

    after(async () => {
      MongoClient.connect.restore();
    });

    it('Retorna mensagem de erro se o body não possui name', async () => {
      response = await chai.request(server)
        .post('/users')
        .send({ email: 'hhackenhaar@gmail.com', password: '444648' });

      expect(response).to.have.status(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    });
    it('Retorna mensagem de erro se o body não possui email', async () => {
      response = await chai.request(server)
        .post('/users')
        .send({ name: 'Heloísa J Hackenhaar', password: '444648' });

      expect(response).to.have.status(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    });
    it('Retorna mensagem de erro se o body não possui password', async () => {
      response = await chai.request(server)
        .post('/users')
        .send({ name: 'Heloísa J Hackenhaar', email: 'hhackenhaar@gmail.com' });

      expect(response).to.have.status(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    });
    it('Retorna erro ao tentar criar um usuário que já existe', async () => {
      response = await chai.request(server)
        .post('/users')
        .send({ name: 'Heloísa J Hackenhaar', email: 'hhackenhaar@gmail.com', password: '444648' });

      expect(response).to.have.status(409);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal('Email already registered');
    })
  }); 
  
});

