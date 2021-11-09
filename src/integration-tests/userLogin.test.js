// Validando o cadastro de usuário 
const { MongoClient } = require('mongodb');
const chai = require('chai');
const sinon = require('sinon');

const { getMockConnection } = require("./connectionMock");
const server = require('../api/app');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const { expect } = chai;

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
      
        after(async () => {
          MongoClient.connect.restore();
        });
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
  });
}); 
