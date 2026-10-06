import Credito from "../class/Credito.js";
import Devolucao_CreditoDAO from "../dal/Devolucao_CreditoDAO.js";

export default class CreditoController {
  #dao = new Devolucao_CreditoDAO();

  Consultar = async (partnerId) => {
    try {
      const credito = new Credito();

      let valor_total = 0;
      let valor_atual = 0;

      const devolucao = await this.#dao.Consultar(partnerId);

      devolucao.forEach((item) => {
        const creditos = new Credito(item);

        valor_atual += creditos.getValorAtual();
        valor_total += creditos.getValorOriginal();
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
