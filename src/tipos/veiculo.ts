export interface Abastecimento {
  id?: string;
  data: number; // Timestamp para facilitar ordenação
  quilometragemAtual: number;
  litros: number;
  precoPorLitro: number;
  valorTotal: number;
  tanqueCheio: boolean;
  aditivado: boolean;
  mediaDesteAbastecimento?: number;
}