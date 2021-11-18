/* É preciso refatorar estes testess porque nao os its nao devem fazer requisições
nem ter done e resopnse juntos
ver nos outros testes ja refatorados. */

const { MongoClient } = require('mongodb');
const chai = require('chai');
const sinon = require('sinon');

const { getMockConnection } = require("./connectionMock");
const server = require('../api/app');
const { status, recipesMessages, usersMessages } = require('../messages');
const { newUser, correctLogin, recipe, reciperecipeWithoutName, recipeWithoutIngredients,
  recipeWithoutPreparation, 
  recipeWithoutName} = require('./helpersObjects');


const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const { expect } = chai;

describe('Testes da rota GET /recipes', () => { 
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
  let connectionMock;
  before(async () => {
    connectionMock = await getMockConnection();
    sinon.stub(MongoClient, 'connect')
    .resolves(connectionMock);
  });
  after(async () => {
    MongoClient.connect.restore();
  });

  describe('Testa caso de sucesso em publicar uma receita', () => {
    let response;
    before(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.insertOne(newUser);
      const { body: { token } } = await chai.request(server).post('/login').send(correctLogin);
      response = await chai.request(server)
        .post('/recipes')
        .set('Authorization', token)
        .send(recipe);
    });
    after(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.deleteOne({ email: newUser.email });
     /*  const recipesCollection = connectionMock.db('Cookmaster').collection('recipes');
      await recipesCollection.deleteOne({name: recipe.name}); */
    });
    it('adiciona uma receita, retorna status 201, e objeto "recipe"', (done) => {
      expect(response).to.have.status(201);
      expect(response.body).to.be.an('object')
      expect(response.body).to.be.property('recipe');
      done();
    })
    it('verifica se objeto "recipe" contém: name com conteudo correspondete', (done) => {
      expect(response.body.recipe).to.be.property('name');
      expect(response.body.recipe.name).to.be.equal('Lasanha vegana');
      done();
    });
    it('verifica se objeto "recipe" contém: ingredients com conteudo correspondete', (done) => {
      expect(response.body.recipe).to.be.property('ingredients')
      expect(response.body.recipe.ingredients).to.be.equal('Panequeca, Brocolis, Alho, FakeCheddar');
      done();
    });
    it('verifica se objeto "recipe" contém: preparation com conteudo correspondete', (done) => {
      expect(response.body.recipe).to.be.property('preparation')
      expect(response.body.recipe.preparation).to.be.equal('2 horas');
      done();
    });
    it('verifica se objeto "recipe" contém: userId, e _id', (done) => {
      expect(response.body.recipe).to.be.property('userId');
      expect(response.body.recipe).to.be.property('_id');
      done();
    });
  });
  describe('Testa casos de falha em publicar uma receita', () => {
    before(async () => {
    const usersCollection = connectionMock.db('Cookmaster').collection('users');
        await usersCollection.insertOne(newUser);
    });
    after(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
      await usersCollection.deleteOne({
        email: 'hhackenhaar@gmail.com'
      });
    })

  describe('Erros em POST /recipes, sem name no body', async () => {
    let response;
    
    before(async () => {
      const { body: { token } } = await chai.request(server).post('/login').send(correctLogin);
      response = await chai.request(server)
        .post('/recipes')
        .set('Authorization', token)
        .send(recipeWithoutName);
    });  
    it('verifica body: sem name, retorna status 400', async (done) => {
      expect(response).to.have.status(status.badRequest);
      done();
    });
    it('verifica body: sem name, retorna message "Invalid entries. Try again."', async (done) => {
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal(usersMessages.invalidEntries);
      done();
    });
  });
  describe('Erros em POST /recipes, sem ingredients no body', async () => {
    let response;
    
    before(async () => {
      const { body: { token } } = await chai.request(server).post('/login').send(correctLogin);
      response = await chai.request(server)
        .post('/recipes')
        .set('Authorization', token)
        .send(recipeWithoutIngredients);
    });
    it('verifica body: sem ingredients, retorna status 400', (done) => {
      expect(response).to.have.status(status.badRequest);
      done();
    });
    it('verifica body: sem ingredients, retorna message "Invalid entries. Try again."', (done) => {
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal(usersMessages.invalidEntries);
      done();
    });
  });
  describe('Erros em POST /recipes, sem preparation no body', async () => {
    let response;
    before(async () => {
      const { body: { token } } = await chai.request(server).post('/login').send(correctLogin);
      response = await chai.request(server)
        .post('/recipes')
        .set('Authorization', token)
        .send(recipeWithoutPreparation);
    });
    it('verifica body: preparation, retorna message e status', (done) => {
      expect(response).to.have.status(status.badRequest);
      done();
    });
    it('verifica body: sem preparation, retorna message "Invalid entries. Try again."', (done) => {
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal(usersMessages.invalidEntries);
      done();
    });
  });
  });
});

describe('Testes da rota PUT /recipes', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getMockConnection();
      sinon.stub(MongoClient, 'connect')
      .resolves(connectionMock);
    const usersCollection = connectionMock.db('Cookmaster').collection('users');
    await usersCollection.insertOne(newUser);
  });

  after(async () => {
    const usersCollection = connectionMock.db('Cookmaster').collection('users');
    await usersCollection.deleteOne({ email: newUser.email });
    MongoClient.connect.restore();
  });

  describe('Teste de sucesso de editar uma receita', () => {
    let response;
    before(async () => {
      const { body: { token } } = await chai.request(server).post('/login').send(correctLogin);
      const { body: { recipe: _id } } = await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send(recipe)

      const { _id: recipeId  } = _id
      response = await chai.request(server)
        .put(`/recipes/${ recipeId }`)
        .set('Authorization', token)
        .send({
          name: 'Lasanha vegana deliciosa',
          ingredients: 'Panequeca, Brocolis, Alho, FakeCheddar, queijo de mandioca',
          preparation: '3 horas'
        });
    });
    
   
    
    it('retorna status de 200, e um objeto', (done) => {
      expect(response).to.have.status(status.sucess);
      expect(response.body).to.be.an('object')
      done();
    });
    it('o objeto retornado contem o conteúdo alterado da receita', (done) => {
      expect(response.body.name).to.be.equal('Lasanha vegana deliciosa');
      expect(response.body.ingredients).to.be.equal('Panequeca, Brocolis, Alho, FakeCheddar, queijo de mandioca');
      expect(response.body.preparation).to.be.equal('3 horas')
      expect(response.body).to.be.property('userId');
      expect(response.body).to.be.property('_id');
      done();
    });
  });
  describe('Testas caso de erros em PUT /recipes', () => {    
    describe('sem :id não encontra a rota', () => {
      let response;
      before(async () => {
        const { body: { token } } = await chai.request(server).post('/login').send(correctLogin);
        response = await chai.request(server)
        .put(`/recipes`)
        .set('Authorization', token)
        .send({
          name: 'Lasanha vegana deliciosa',
          ingredients: 'Panequeca, Brocolis, Alho, FakeCheddar, queijo de mandioca',
          preparation: '3 horas'
        });
      });
      it('Retorna status 404', (done) => {
        expect(response).to.have.status(status.notFound);
        done();
      }); 
    });
    describe('Verificação do body: sem name, não altera receita', () => {
      let response;
      before(async () => {
        const { body: { token } } = await chai.request(server).post('/login').send(correctLogin);
        const { body: { recipe: _id } } = await chai.request(server)
        .post('/recipes')
        .set('Authorization', token)
        .send(recipe);
        const { _id: recipeId  } = _id
        response = await chai.request(server)
        .put(`/recipes/${ recipeId }`)
        .set('Authorization', token)
        .send(recipeWithoutName);
      });
      it('Retorna status 400', (done) => {
        expect(response).to.have.status(status.badRequest);
        done();
      });
      it('Retorna propriedade message com valor "Invalid entries. Try again.', (done) => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal(usersMessages.invalidEntries);
        done();
      });
    });
    describe('Verificação do body: sem ingredients, não altera receita', () => {
      let response;
      before(async () => {
        const { body: { token } } = await chai.request(server).post('/login').send(correctLogin);
        const { body: { recipe: _id } } = await chai.request(server)
        .post('/recipes')
        .set('Authorization', token)
        .send(recipe);
        const { _id: recipeId  } = _id
        response = await chai.request(server)
        .put(`/recipes/${ recipeId }`)
        .set('Authorization', token)
        .send(recipeWithoutIngredients);
      });
      it('Retorna status 400', (done) => {
        expect(response).to.have.status(status.badRequest);
        done();
      });
      it('Retorna propriedade message com valor "Invalid entries. Try again.', (done) => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal(usersMessages.invalidEntries);
        done();
      });
    });
    describe('Verificação do body: sem preparation, não altera receita', () => {
      let response;
      before(async () => {
        const { body: { token } } = await chai.request(server).post('/login').send(correctLogin);
        const { body: { recipe: _id } } = await chai.request(server)
        .post('/recipes')
        .set('Authorization', token)
        .send(recipe);
        const { _id: recipeId  } = _id
        response = await chai.request(server)
        .put(`/recipes/${ recipeId }`)
        .set('Authorization', token)
        .send(recipeWithoutIngredients);
      });
      it('retorna status 400', (done) => {
        expect(response).to.have.status(status.badRequest);
        done();
      });
      it('Retorna propriedade message com valor "Invalid entries. Try again.', (done) => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.equal(usersMessages.invalidEntries);
        done();
      });
    });
  });
});

describe('Teste da rota DELETE / recipes', () => {
  let connectionMock;
  before(async () => {
    connectionMock = await getMockConnection();
    sinon.stub(MongoClient, 'connect')
    .resolves(connectionMock);

    const usersCollection = connectionMock.db('Cookmaster').collection('users');
    await usersCollection.insertOne(newUser);
  });
  after(async () => {
    const usersCollection = connectionMock.db('Cookmaster').collection('users');
    await usersCollection.deleteOne({ email: newUser.email });
    MongoClient.connect.restore();
  });

  describe('Teste de sucesso de DELETE /recipes', () => {
    let response;
    before(async () => {
      const { body: { token } } = await chai.request(server).post('/login').send(correctLogin);
      const { body: { recipe: _id } } = await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send(recipe)

      const { _id: recipeId  } = _id
      response = await chai.request(server)
        .delete(`/recipes/${ recipeId }`)
        .set('Authorization', token)
    });
    it('Retorna status 204', (done) => {
      expect(response).to.have.status(status.noContent);
      done();
    });
  });
  describe('Testas caso de erros em DELETE /recipes, sem id', () => {
    let response;
    before(async () => {
      const { body: { token } } = await chai.request(server).post('/login').send(correctLogin);
      const { body: { recipe: _id } } = await chai.request(server)
      .post('/recipes')
      .set('Authorization', token)
      .send(recipe)

      response = await chai.request(server)
        .delete(`/recipes/`)
        .set('Authorization', token)
    });
    it('Retorna status 404', (done) => {
      expect(response).to.have.status(status.notFound);
      done();
    });
  });
});