const { MongoClient } = require('mongodb');
const chai = require('chai');
const sinon = require('sinon');

const { getMockConnection } = require("./connectionMock");
const server = require('../api/app');
const { status, recipesMessages, usersMessages } = require('../messages');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const { expect } = chai;

const userMock = {
  name: 'Heloísa J. Hackenahar',
  email: 'hhackenhaar@gmail.com',
  password: '444648'
}

const recipeMock = {
  name: 'Lasanha vegana',
  ingredients: 'Panequeca, Brocolis, Alho, FakeCheddar',
  preparation: '2 horas'
}

describe('Testes da rota GET /recipes', () => { 
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
})

describe('Testes da rota POST /recipes', () => {
  describe('Testa caso de sucesso em publicar uma receita', () => {
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
        .post('/recipes')
        .set('Authorization', token)
        .send({
          name: 'Lasanha vegana',
          ingredients: 'Panequeca, Brocolis, Alho, FakeCheddar',
          preparation: '2 horas'
        });
    });
    it('adiciona uma receita, retorna status 201, e objeto "recipe"', async() => {
      expect(response).to.have.status(201);
      expect(response.body).to.be.an('object')
      expect(response.body).to.be.property('recipe');
    })
    it('verifica se objeto "recipe" contém: name com conteudo correspondete', async() => {
      expect(response.body.recipe).to.be.property('name');
      expect(response.body.recipe.name).to.be.equal('Lasanha vegana');
    });
    it('verifica se objeto "recipe" contém: ingredients com conteudo correspondete', async() => {
      expect(response.body.recipe).to.be.property('ingredients')
      expect(response.body.recipe.ingredients).to.be.equal('Panequeca, Brocolis, Alho, FakeCheddar');
    });
    it('verifica se objeto "recipe" contém: preparation com conteudo correspondete', async() => {
      expect(response.body.recipe).to.be.property('preparation')
      expect(response.body.recipe.preparation).to.be.equal('2 horas');
    });
    it('verifica se objeto "recipe" contém: userId, e _ud com conteudo correspondete', async() => {
      expect(response.body.recipe).to.be.property('userId');
      expect(response.body.recipe).to.be.property('_id');
    });
  });
  describe.only('testa casos de erros de POST /recipes, com token', async () => {
    let response;
    
    before(async () => {
      const connectionMock = await getMockConnection();
      sinon.stub(MongoClient, 'connect')
      .resolves(connectionMock);
  
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne(userMock);      
    });
    
    it('verifica body: sem name, retorna message e status', async () => {
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'hhackenhaar@gmail.com',
          password: '444648'
        })
        .then((res) => res.body.token);

      response = await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send({
        ingredients: 'Panequeca, Brocolis, Alho, FakeCheddar',
        preparation: '2 horas'
      });

      expect(response).to.have.status(status.badRequest);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal(usersMessages.invalidEntries);
    });
    it('verifica body: sem ingredients, retorna message e status', async () => {
      const token = await chai.request(server)
      .post('/login')
      .send({
        email: 'hhackenhaar@gmail.com',
        password: '444648'
      })

      .then((res) => res.body.token);
      response = await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send({
        name: 'Lasanha vegana',
        preparation: '2 horas'
      });
    expect(response).to.have.status(status.badRequest);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.be.equal(usersMessages.invalidEntries);
    });
    it('verifica body: preparation, retorna message e status', async () => {
      const token = await chai.request(server)
      .post('/login')
      .send({
        email: 'hhackenhaar@gmail.com',
        password: '444648'
      })
      .then((res) => res.body.token);
    
      response = await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send({
        name: 'Lasanha vegana',
        ingredients: 'Panequeca, Brocolis, Alho, FakeCheddar',
      });
    expect(response).to.have.status(status.badRequest);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.be.equal(usersMessages.invalidEntries);
    });
  }); 
});

