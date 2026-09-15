import type { Request, Response } from "express";
import type OrdemDeImpressao from "../class/OrdemDeImpressao.js";
import type Produto from "../class/Produto.js";
import LoteDAO from "../dal/LoteDAO.js";
import { loteNomeador } from "../utils/loteNomeador.js";

type TLoteProduto = {
  produto: Produto;
  quantidade: number;
};
export default class LoteController {
  private dao = new LoteDAO();

  Criar = async (
    item: Produto,
    order: OrdemDeImpressao,
    quantidade: number,
  ) => {
    try {
      let nomeLote = loteNomeador(order, item);

      if (await this.dao.Criar(item, nomeLote, order, quantidade)) return true;
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  Consultar = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const response = await this.dao.Consultar(Number(id));
      console.log(response);
      return res.status(200).json({ response });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error });
    }
  };
  atualizarEstoque = async () => {};
}
