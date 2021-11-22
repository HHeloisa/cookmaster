const { MongoClient } = require('mongodb');
const chai = require('chai');
const sinon = require('sinon');
const { getMockConnection } = require("./connectionMock");
const server = require('../api/app');
const { adminUser, newAdmin, correctLogin, newUser } = require('./helpersObjects');
const { status, usersMessages } = require('../messages');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { expect } = chai;

describe.only('Valida a rota post /users/admin', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getMockConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });
  describe('Testa caso de sucesso na rota /users/admin', () => {
    let response;

    before(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      const users = [
        { name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' }
      ];
      await usersCollection.insertMany(users);
      const { body: { token } } = await chai.request(server).post('/login').send(adminUser);
      response = await chai.request(server)
        .post('/users/admin')
        .set('Authorization', token)
        .send(newAdmin);
    })
    after(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.deleteOne({
        email: 'newAdm@email.com'
      });
    })
    it('Retorna status 201', () => {
      expect(response).to.have.status(status.create);
    });
    it('Espera que o retorno em body seja um objeto com a propriedade "user"', (done) => {
      expect(response.body).to.be.an('object')
      expect(response.body).to.be.property('user');
      done();
    });
    it('Espera que o objeto "user" tenha a propriedade "name"', (done) => {
      expect(response.body.user).to.be.property('name');
      expect(response.body.user['name']).to.be.a('string');
      expect(response.body.user.name).to.be.equal(newAdmin.name);
      done();
    });
    it('Espera que o objeto "user" tenha a propriedade "email"', (done) => {
      expect(response.body.user).to.be.property('email');
      expect(response.body.user['email']).to.be.a('string');
      expect(response.body.user.email).to.be.equal(newAdmin.email);
      done();
    });
    it('Espera que o objeto "user" tenha a propriedade "_id"', (done) => {
      expect(response.body.user).to.be.property('_id');
      expect(response.body.user['_id']).to.be.a('string');
      done();
    });
    it('Espera que o objeto "user" tenha a propriedade "role"', (done) => {
      expect(response.body.user).to.be.property('role');
      expect(response.body.user['role']).to.be.a('string');
      expect(response.body.user.role).to.be.equal('admin');
      done();
    });
  })
  describe('Testa caso de falha na rota /users/admin se role:user' , () => {
    let response;

    before(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne(newUser);
      const { body: { token } } = await chai.request(server).post('/login').send(correctLogin);
      response = await chai.request(server)
        .post('/users/admin')
        .set('Authorization', token)
        .send(newAdmin);
    })
    after(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.deleteOne({ email: newUser.email });
    });
    it('verifica se retorna status "401"', (done) => {
      console.log(response.body)
      expect(response).to.have.status(status.forbidden);
      done();
    });
    it('verifica se "message" corresponde a "Only admins can register new admins"', (done) => {
      expect(response.body.message).to.be.equals(usersMessages.onlyAdmin);
      done();
    });
  });
});
