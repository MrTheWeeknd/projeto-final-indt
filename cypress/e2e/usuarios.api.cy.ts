describe('Testes de API - Usuários', () => {
  let usuarioId: number;
  const emailTeste = `teste_${Date.now()}@email.com`;

  it('Deve criar um novo usuário (POST)', () => {
    cy.request({
      method: 'POST',
      url: '/usuarios',
      body: {
        email: emailTeste,
        senha: 'senha_segura_123'
      }
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 201]);
      expect(response.body).to.have.property('id');
      expect(response.body.email).to.eq(emailTeste);
      
      usuarioId = response.body.id;
    });
  });

  it('Deve listar os usuários (GET)', () => {
    cy.request('GET', '/usuarios').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
    });
  });

  it('Deve buscar o usuário criado (GET)', () => {
    cy.request('GET', `/usuarios/${usuarioId}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.email).to.eq(emailTeste);
    });
  });

  it('Deve atualizar o e-mail do usuário (PUT)', () => {
    const novoEmail = `updated_${Date.now()}@email.com`;
    cy.request({
      method: 'PUT',
      url: `/usuarios/${usuarioId}`,
      body: {
        email: novoEmail
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

});