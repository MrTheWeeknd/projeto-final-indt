describe('Fluxo de Integração - Gestão de Estoque', () => {
  let usuarioId: number;
  let categoriaId: number;
  let insumoId: number;
  let movimentacaoId: number;

  const timestamp = Date.now();
  const emailTeste = `admin_${timestamp}@estoque.com`;
  const codigoInsumo = `INS-${timestamp}`;

  it('Deve criar um usuário para auditoria', () => {
    cy.request('POST', '/usuarios', {
      email: emailTeste,
      senha: 'password123'
    }).then((res) => {
      expect(res.status).to.be.oneOf([200, 201]);
      usuarioId = res.body.id;
    });
  });

  it('Deve criar uma categoria para o insumo', () => {
    cy.request('POST', '/categorias', {
      nome: 'Eletrônicos',
      descricao: 'Componentes e dispositivos'
    }).then((res) => {
      expect(res.status).to.be.oneOf([200, 201]);
      categoriaId = res.body.id;
    });
  });

  it('Deve criar um novo insumo vinculado à categoria', () => {
    cy.request('POST', '/insumos', {
      codigo: codigoInsumo,
      nome: 'Sensor de Presença',
      descricao: 'Sensor infravermelho para automação',
      categoriaId: categoriaId,
      unidadeMedida: 'UN',
      estoqueAtual: 10,
      estoqueMinimo: 5,
      estoqueMaximo: 50,
      localizacao: 'Prateleira A1'
    }).then((res) => {
      expect(res.status).to.be.oneOf([200, 201]);
      expect(res.body.categoria.id).to.eq(categoriaId);
      insumoId = res.body.id;
    });
  });

  it('Deve registrar uma movimentação de entrada', () => {
    cy.request('POST', '/movimentacoes', {
      insumoId: insumoId,
      usuarioId: usuarioId,
      tipo: 'entrada',      
      motivo: 'compra',     
      quantidade: 15,
      observacao: 'Cypress: Teste de entrada de estoque',
      linhaDestino: 'Linha de Montagem 01'
    }).then((res) => {
      expect(res.status).to.be.oneOf([200, 201]);
      expect(res.body.insumo.id).to.eq(insumoId);
      expect(res.body.usuario.id).to.eq(usuarioId);
      expect(res.body.saldoApos).to.be.a('number');
      movimentacaoId = res.body.id;
    });
  });

  it('Deve validar se o estoque do insumo foi atualizado após a movimentação', () => {
    cy.request('GET', `/insumos/${insumoId}`).then((res) => {
      expect(res.body.estoqueAtual).to.be.at.least(10); 
    });
  });
  it('Deve listar movimentações e conter a que foi criada', () => {
    cy.request('GET', '/movimentacoes').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
      const item = res.body.find((m: any) => m.id === movimentacaoId);
      expect(item).to.exist;
    });
  });
});