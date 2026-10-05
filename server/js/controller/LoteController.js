import LoteDAO from "../dal/LoteDAO.js";
import { loteNomeador } from "../utils/loteNomeador.js";

export default class LoteController {
  #dao = new LoteDAO();

  Criar = async (item, order, quantidade) => {
    try {
      const nomeLote = loteNomeador(order, item);

      if (await this.#dao.Criar(item, nomeLote, order, quantidade)) {
        return true;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  Consultar = async (req, res) => {
    const { id } = req.params;

    try {
      const response = await this.#dao.consultarOrdem(Number(id));

      console.log(response);

      return res.status(200).json({ response });
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        message: error,
      });
    }
  };

  atualizarEstoque = async () => {};
}
