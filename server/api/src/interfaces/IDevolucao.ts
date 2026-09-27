export interface IDevolucao {
  id?: number;
  data_devolucao: number;
  motivo: string;
  valor_original: number;
  valor_atual: number;
  fk_parceiro_id: number;
  fk_campanha_id?: number;
}
