const { MongoClient } = require('mongodb');
const chai = require('chai');
const sinon = require('sinon');

const { getMockConnection } = require("./connectionMock");
const server = require('../api/app');
const { status, usersMessages } = require('../messages');
const { newUser, userWithoutEmail, userWithoutName, userWithoutPassW } = require('./helpersObjects');


const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const { expect } = chai;


describe('Valida a rota post /users', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getMockConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);    
  });

  after(async () => {
    MongoClient.connect.restore();
  });

  describe('Cadastro de usuário realizado com sucesso', () => {
    let response;

    before(async () => {
      response = await chai.request(server).post('/users').send(newUser);
    })
    after(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.deleteOne({
        email: 'hhackenhaar@gmail.com'
      });
    })
    it('Espera que o retorno em body seja um objeto com a propriedade "user"', (done) => {
      expect(response.body).to.be.an('object')
      expect(response.body).to.be.property('user');
      done();
    });
    it('Espera que o objeto "user" tenha a propriedade "name"', (done) => {
      expect(response.body.user).to.be.property('name');
      expect(response.body.user['name']).to.be.a('string');
      expect(response.body.user.name).to.be.equal(newUser.name);
      done();
    });
    it('Espera que o objeto "user" tenha a propriedade "email"', (done) => {
      expect(response.body.user).to.be.property('email');
      expect(response.body.user['email']).to.be.a('string');
      expect(response.body.user.email).to.be.equal('hhackenhaar@gmail.com');
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
      expect(response.body.user.role).to.be.equal('user');
      done();
    });
    it('Espera que o status seja 201, create', (done) => {
      expect(response).to.have.status(status.create);
      done();
    });
  });

  describe('Erro no cadastro de usuário', () => {
    describe('Valida se o email, password e name são obrigatórios', () => {
      let response;

      before(async () => {
        response = await chai.request(server).post('/users').send({});
      })

      it('verifica se retorna status "400"', (done) => {
        expect(response).to.have.status(status.badRequest);
        done();
      });
      it('verifica se "message" corresponde a "Invalid entries. Try again."', (done) => {
        expect(response.body.message).to.be.equals(usersMessages.invalidEntries);
        done();
      });
    });
    describe('Valida o campo email', () => {
      let response;
  
      before(async () => {
        response = await chai.request(server).post('/users').send(userWithoutEmail);
      });

      it('Retorna status 400 se o body não possui email', (done) => {
        expect(response).to.have.status(status.badRequest);
        done();
      });
      it('Retorna propriedade message com mensagem "Invalid entries. Try again."', (done) => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal(usersMessages.invalidEntries);
        done();
      });
    });
    describe('Valida o campo password', () => {
      let response;
  
      before(async () => {
        response = await chai.request(server).post('/users').send(userWithoutPassW);
      });

      it('Retorna status 400 se o body não possui password', (done) => {
        expect(response).to.have.status(status.badRequest);
        done();
      });
      it('Retorna propriedade message com mensagem "Invalid entries. Try again."', (done) => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal(usersMessages.invalidEntries);
        done();
      });
    })
    describe('Valida o campo name', () => {
      let response;
  
      before(async () => {
        response = await chai.request(server).post('/users').send(userWithoutName);
      });
      it('Retorna status 400 se o body não possui name', (done) => {
        expect(response).to.have.status(status.badRequest);
        done();
      });
      it('Retorna propriedade message com mensagem "Invalid entries. Try again."', (done) => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal(usersMessages.invalidEntries);
        done();
      });
    });
    describe('Verifica que não é possível criar um usuário com email existente no banco de dados', () => {
      let response;
      before(async () => {
        const usersCollection = connectionMock.db('Cookmaster').collection('users');
        await usersCollection.insertOne({
          name: 'Heloísa J. Hackenahar',
          email: 'hhackenhaar@gmail.com',
          password: '444648'
        });
  
        response = await chai.request(server).post('/users').send(newUser)
      });
  
      after(async () => {
        const usersCollection = connectionMock.db('Cookmaster').collection('users');
        await usersCollection.deleteOne({
          email: 'hhackenhaar@gmail.com'
        });
      })
  
      it('Retorna status 409 se o email já existe no banco de dados', (done) => {
        expect(response).to.have.status(status.conflict);
        done();
      });
      it('Retorna propriedade message com mensagem "Email already registered"', (done) => {
        expect(response.body.message).to.be.equals(usersMessages.emailNotUnic);
        done();
      })
    });
  }); 
});