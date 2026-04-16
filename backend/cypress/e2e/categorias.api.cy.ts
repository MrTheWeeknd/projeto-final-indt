describe('Testes de API - Categorias', () => {
  let categoriaId: number;

  it('Deve criar uma nova categoria (POST)', () => {
    cy.request({
      method: 'POST',
      url: '/categorias',
      body: {
        nome: 'Ferramentas de Teste',
        descricao: 'Categoria criada automaticamente pelo Cypress'
      }
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 201]); 
      
      expect(response.body).to.have.property('id');
      expect(response.body.nome).to.eq('Ferramentas de Teste');
      
      categoriaId = response.body.id;
    });
  });

  it('Deve listar as categorias (GET)', () => {
    cy.request('GET', '/categorias').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0); 
    });
  });

  it('Deve buscar uma categoria específica por ID (GET)', () => {
    cy.request('GET', `/categorias/${categoriaId}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq(categoriaId);
      expect(response.body.nome).to.eq('Ferramentas de Teste');
    });
  });

  it('Deve atualizar os dados da categoria (PUT)', () => {
    cy.request({
      method: 'PUT',
      url: `/categorias/${categoriaId}`,
      body: {
        nome: 'Ferramentas Atualizadas'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.nome).to.eq('Ferramentas Atualizadas');
    });
  });

  it('Deve remover a categoria (DELETE)', () => {
    cy.request('DELETE', `/categorias/${categoriaId}`).then((response) => {
      expect(response.status).to.be.oneOf([200, 204]); 
    });

    cy.request({
      method: 'GET',
      url: `/categorias/${categoriaId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });
});