import Credito from "../class/Credito.js";
import Devolucao_CreditoDAO from "../dal/Devolucao_CreditoDAO.js";

export default class CreditoController {
  #dao = new Devolucao_CreditoDAO();

  Consultar = async (partnerId) => {
    try {
      const credito = new Credito();

      // let valor_total = 0;
      // let valor_atual = 0;

      const { valorOriginal, valorAtual } =
        await this.#dao.ConsultarSaldo(partnerId);

      credito.setValorOriginal(valorOriginal);
      credito.setValorAtual(valorAtual);

      console.log(credito);

      return credito;
    } catch (error) {
      console.log(`Erro ao consultar créditos: ${error}`);
      throw error;
    }
  };
}
