import { Router } from 'express';
import { autenticarToken } from '../middleware/authMiddleware.js';
import authRouter from './authRoutes.js';
import categoriaRouter from './categoriaRoutes.js';
import dashboardRouter from './dashboardRoutes.js';
import insumoRouter from './insumoRoutes.js';
import movimentacaoRouter from './movimentacaoRoutes.js';
import usuarioRouter from './usuarioRoutes.js';

const indexRouter = Router();

indexRouter.use('/auth', authRouter);
indexRouter.use('/usuarios', usuarioRouter);
indexRouter.use(autenticarToken);

indexRouter.use('/categorias', categoriaRouter);
indexRouter.use('/dashboard', dashboardRouter);
indexRouter.use('/insumos', insumoRouter);
indexRouter.use('/movimentacoes', movimentacaoRouter);

export default indexRouter;
