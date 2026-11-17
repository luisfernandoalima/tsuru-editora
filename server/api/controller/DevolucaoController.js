import DevolucaoDAO from "../dal/Devolucao_CreditoDAO.js";
import showLog from "../utils/showLog.js";

export default class DevolucaoController {
  #dao = new DevolucaoDAO();

  Criar = async (req, res) => {
    try {
      showLog("Criando nova devolução");

      const { saidaId, motivo, itens } = req.body;

      if (!Number.isInteger(Number(saidaId))) {
        return res
          .status(400)
          .json({ message: "ID da saída inválido.", type: "error" });
      }

      if (!motivo?.trim()) {
        return res
          .status(400)
          .json({ message: "Informe o motivo da devolução.", type: "error" });
      }

      if (!Array.isArray(itens)) {
        return res
          .status(400)
          .json({ message: "Itens inválidos.", type: "error" });
      }

      // Ignora quantidade <= 0 e junta lotes repetidos
      const agrupados = new Map();
      for (const item of itens) {
        const loteId = Number(item.loteId);
        const quantidade = Number(item.quantidade);

        if (!Number.isInteger(loteId)) {
          return res
            .status(400)
            .json({ message: "ID de lote inválido.", type: "error" });
        }
        if (!Number.isInteger(quantidade) || quantidade < 0) {
          return res
            .status(400)
            .json({ message: "Quantidade inválida.", type: "error" });
        }
        if (quantidade === 0) continue;

        agrupados.set(loteId, (agrupados.get(loteId) ?? 0) + quantidade);
      }

      if (!agrupados.size) {
        return res.status(400).json({
          message: "Informe a quantidade de ao menos um lote.",
          type: "error",
        });
      }

      const devolucao = await this.#dao.Criar({
        saidaId: Number(saidaId),
        motivo: motivo.trim(),
        itens: [...agrupados].map(([loteId, quantidade]) => ({
          loteId,
          quantidade,
        })),
      });

      return res.status(201).json({
        message: "Devolução registrada com sucesso!",
        devolucao,
      });
    } catch (error) {
      showLog(`Não foi possível criar a devolução: ${error}`);

      // Erros de regra (404/400) vêm do DAO com .status
      return res.status(error.status ?? 500).json({
        message: error.status ? error.message : "Erro ao registrar devolução.",
        type: "error",
      });
    }
  };
  Listar = async (req, res) => {
    try {
      showLog("Listando devoluções");

      const devolucoes = await this.#dao.Listar();

      return res.status(200).json({ devolucoes });
    } catch (error) {
      showLog(`Não foi possível listar as devoluções: ${error}`);
      return res.status(error.status ?? 500).json({
        message: "Erro ao listar as devoluções.",
        type: "error",
      });
    }
  };
}
