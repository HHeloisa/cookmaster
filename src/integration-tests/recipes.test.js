/* É preciso refatorar estes testess porque nao os its nao devem fazer requisições
nem ter done e resopnse juntos
ver nos outros testes ja refatorados. */

const { MongoClient } = require('mongodb');
const chai = require('chai');
const sinon = require('sinon');

const { getMockConnection } = require("./connectionMock");
const server = require('../api/app');
const { status, recipesMessages, usersMessages } = require('../messages');
const { newUser, recipe /* userWithoutEmail, userWithoutName, userWithoutPassW */ } = require('./helpersObjects');


const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const { expect } = chai;

describe.only('Testes da rota GET /recipes', () => { 
  let connectionMock;

  before(async () => {
    connectionMock = await getMockConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);    
  });

  after(async () => {
    MongoClient.connect.restore();
  });
  describe('testa caso de sucesso em buscar todas as receitas', () => {
    let response;

    before(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne(newUser);
  
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

    after(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.deleteOne({
        email: 'hhackenhaar@gmail.com'
      });
    })
      
    it('retorna código de status "200"', (done) => {
      expect(response).to.have.status(200);
      done();
    });
    it('retorna um array no body', (done) => {
      expect(response.body).to.be.an('array');
      done();
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
      await usersCollection.insertOne(newUser);
  
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
    after(async () => {
      MongoClient.connect.restore();
    });
    });
    it('adiciona uma receita, retorna status 201, e objeto "recipe"', async(done) => {
      expect(response).to.have.status(201);
      expect(response.body).to.be.an('object')
      expect(response.body).to.be.property('recipe');
      done();
    })
    it('verifica se objeto "recipe" contém: name com conteudo correspondete', async(done) => {
      expect(response.body.recipe).to.be.property('name');
      expect(response.body.recipe.name).to.be.equal('Lasanha vegana');
      done();
    });
    it('verifica se objeto "recipe" contém: ingredients com conteudo correspondete', async(done) => {
      expect(response.body.recipe).to.be.property('ingredients')
      expect(response.body.recipe.ingredients).to.be.equal('Panequeca, Brocolis, Alho, FakeCheddar');
      done();
    });
    it('verifica se objeto "recipe" contém: preparation com conteudo correspondete', async(done) => {
      expect(response.body.recipe).to.be.property('preparation')
      expect(response.body.recipe.preparation).to.be.equal('2 horas');
      done();
    });
    it('verifica se objeto "recipe" contém: userId, e _ud com conteudo correspondete', async(done) => {
      expect(response.body.recipe).to.be.property('userId');
      expect(response.body.recipe).to.be.property('_id');
      done();
    });
  });
  describe('Testa casos de erros de POST /recipes, com token', async () => {
    let response;
    
    before(async () => {
      const connectionMock = await getMockConnection();
      sinon.stub(MongoClient, 'connect')
      .resolves(connectionMock);
  
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne(newUser);      
    });
    after(async () => {
      MongoClient.connect.restore();
    });

    it('verifica body: sem name, retorna message e status', async (done) => {
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
      done();
    });
    it('verifica body: sem ingredients, retorna message e status', async (done) => {
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
    done();
    });
    it('verifica body: preparation, retorna message e status', async (done) => {
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
    done();
    });
  });

});

describe('Testes da rota PUT /recipes', () => {
  describe('Teste de sucesso de PUT /recipes', () => {
    let response;
    before(async () => {
      const connectionMock = await getMockConnection();
      sinon.stub(MongoClient, 'connect')
      .resolves(connectionMock);

      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne(newUser);
  
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
      .set('Authorization', token)
      .send({
        name: 'Lasanha vegana deliciosa',
        ingredients: 'Panequeca, Brocolis, Alho, FakeCheddar, queijo de mandioca',
        preparation: '3 horas'
      });
    });
    after(async () => {
      MongoClient.connect.restore();
    });
    it('retorna status de sucesso, e um objeto', async (done) => {
      expect(response).to.have.status(status.sucess);
      expect(response.body).to.be.an('object')
      done();
    });
    it('o objeto retornado contem o conteúdo alterado da receita', async (done) => {
      expect(response.body.name).to.be.equal('Lasanha vegana deliciosa');
      expect(response.body.ingredients).to.be.equal('Panequeca, Brocolis, Alho, FakeCheddar, queijo de mandioca');
      expect(response.body.preparation).to.be.equal('3 horas')
      expect(response.body).to.be.property('userId');
      expect(response.body).to.be.property('_id');
      done();
    });
  });
  describe('Testas caso de erros em PUT /recipes', () => {
    before(async () => {
      const connectionMock = await getMockConnection();
      sinon.stub(MongoClient, 'connect')
      .resolves(connectionMock);

      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne(newUser);
    });
    after(async () => {
      MongoClient.connect.restore();
    });
    it('sem :id não encontra a rota', async (done) => {
      const token = await chai.request(server)
      .post('/login')
      .send({
        email: 'hhackenhaar@gmail.com',
        password: '444648'
      })
      .then((res) => res.body.token);

      const response = await chai.request(server)
      .put(`/recipes`)
      .set('Authorization', token)
      .send({
        name: 'Lasanha vegana deliciosa',
        ingredients: 'Panequeca, Brocolis, Alho, FakeCheddar, queijo de mandioca',
        preparation: '3 horas'
      });

      expect(response).to.have.status(status.notFound);
      done();
    }); 
    it('sem "name", não realiza alteração, retorna status e message', async (done) => {
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
      .set('Authorization', token)
      .send({
        ingredients: 'Panequeca, Brocolis, Alho, FakeCheddar, queijo de mandioca',
        preparation: '3 horas'
      });
    expect(response).to.have.status(status.badRequest);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.be.equal(usersMessages.invalidEntries);
    done();
    });
    it('sem "ingredients", não realiza alteração, retorna status e message', async (done) => {
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
      .set('Authorization', token)
      .send({ name: 'Lasanha vegana', preparation: '3 horas' });

    expect(response).to.have.status(status.badRequest);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.be.equal(usersMessages.invalidEntries);
    done();
    });
    it('sem "preparation", não realiza alteração, retorna status e message', async (done) => {
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
      .set('Authorization', token)
      .send({ name: 'Lasanha vegana', ingredients: 'Panequeca, Brocolis, Alho, FakeCheddar' });
      
    expect(response).to.have.status(status.badRequest);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.be.equal(usersMessages.invalidEntries);
    done();
    });
  });
});


describe('Teste da rota DELETE / recipes', () => {
  describe('Teste de sucesso de DELETE /recipes', () => {
    let response;
    before(async () => {
      const connectionMock = await getMockConnection();
      sinon.stub(MongoClient, 'connect')
      .resolves(connectionMock);

      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne(newUser);
  
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
      .set('Authorization', token);
    });
    after(async () => {
      MongoClient.connect.restore();
    });
    it('Retorna status 204', (done) => {
      expect(response).to.have.status(status.noContent);
      done();
    });
  });
  describe('Testas caso de erros em DELETE /recipes', () => {
    before(async () => {
      const connectionMock = await getMockConnection();
      sinon.stub(MongoClient, 'connect')
      .resolves(connectionMock);

      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne(newUser);
    });
    after(async () => {
      MongoClient.connect.restore();
    });
    it('sem :id não encontra a rota', async (done) => {
      const token = await chai.request(server)
      .post('/login')
      .send({
        email: 'hhackenhaar@gmail.com',
        password: '444648'
      })
      .then((res) => res.body.token);

      const response = await chai.request(server)
      .delete(`/recipes`)
      .set('Authorization', token)
      .send({
        name: 'Lasanha vegana deliciosa',
        ingredients: 'Panequeca, Brocolis, Alho, FakeCheddar, queijo de mandioca',
        preparation: '3 horas'
      });
      expect(response).to.have.status(status.notFound);
      done();
    });
  });
});