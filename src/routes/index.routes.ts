import { Router } from 'express';
import categoriaRouter from './categoriaRoutes.js';
import insumoRouter from './insumoRoutes.js';
import movimentacaoRouter from './movimentacaoRoutes.js';
import usuarioRouter from './usuarioRoutes.js';

const indexRouter = Router();

indexRouter.use('/categorias', categoriaRouter);
indexRouter.use('/insumos', insumoRouter);
indexRouter.use('/movimentacoes', movimentacaoRouter);
indexRouter.use('/usuarios', usuarioRouter);

export default indexRouter;