import Credito from "../class/Credito.js";
import Devolucao_CreditoDAO from "../dal/Devolucao_CreditoDAO.js";

export default class CreditoController {
  private dao = new Devolucao_CreditoDAO();

  Consultar = async (partnerId: number) => {
    try {
      const credito = new Credito();
      let valor_total = 0;
      let valor_atual = 0;

      let devolucao = await this.dao.Consultar(partnerId);

      devolucao.forEach((item) => {
        let creditos = new Credito(item);
        valor_atual += credito.getValorAtual();
        valor_total += credito.getValorOriginal();
      });

      credito.setValorAtual(valor_atual);
      credito.setValorOriginal(valor_total);

      return credito;
    } catch (error) {
      console.log(`Erro ao consultar créditos: ${error}`);
      throw error;
    }
  };
}
