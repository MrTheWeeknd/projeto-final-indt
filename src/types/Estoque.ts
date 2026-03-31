export const tiposMovimentacao = ["entrada", "saida"] as const;
export type TipoMovimentacao = (typeof tiposMovimentacao)[number];

export const motivosMovimentacao = [
    "compra",
    "devolucao",
    "consumo",
    "perda",
    "ajuste",
] as const;
export type MotivoMovimentacao = (typeof motivosMovimentacao)[number];
