import CampanhaDoacaoDAO from "../dal/CampanhaDoacaoDAO.js";
import showLog from "../utils/showLog.js";

const STATUS_VALIDOS = ["ativa", "encerrada", "cancelada"];

export default class CampanhaDoacaoController {
  #dao = new CampanhaDoacaoDAO();

  Criar = async (req, res) => {
    try {
      showLog("Criando nova campanha");

      const { nome, descricao, data, status } = req.body;

      if (!nome?.trim() || !data) {
        return res.status(400).json({
          message: "Nome e data da campanha são obrigatórios.",
        });
      }

      if (status && !STATUS_VALIDOS.includes(status)) {
        return res.status(400).json({
          message: `Status inválido. Use: ${STATUS_VALIDOS.join(", ")}.`,
        });
      }

      const campanha = await this.#dao.Criar({
        nome: nome.trim(),
        descricao: descricao?.trim() || null,
        data,
        status: status ?? "ativa",
      });

      if (!campanha) {
        return res.status(500).json({ message: "Erro ao criar campanha." });
      }

      res.status(201).json({
        message: "Campanha criada com sucesso!",
        campanha,
      });
    } catch (error) {
      showLog(`Não foi possível criar uma nova campanha: ${error}`);
      res.status(500).json({
        message: `Erro ao criar campanha: ${error}`,
      });
    }
  };

  ConsultarDetalhes = async (campanhaId) => {
    try {
      const campanha = await this.#dao.ConsultarPorId(campanhaId);
      if (!campanha) throw erro(404, "Campanha não encontrada.");

      const lotes = await this.#dao.ListarLotesDevolvidos(campanhaId);

      const totalUnidades = lotes.reduce(
        (soma, item) => soma + Number(item.quantidade),
        0,
      );

      return { campanha, lotes, totalUnidades };
    } catch (error) {
      console.log(`Erro ao consultar detalhes da campanha: ${error}`);
      throw error;
    }
  };

  Consultar = async (req, res) => {
    try {
      const campanhaId = Number(req.params.id);
      if (!Number.isInteger(campanhaId) || campanhaId <= 0) {
        return res.status(400).json({ message: "Campanha inválida." });
      }

      const campanha = await this.#dao.ConsultarPorId(campanhaId);
      if (!campanha) {
        return res.status(404).json({ message: "Campanha não encontrada." });
      }

      const lotes = await this.#dao.ListarLotesDevolvidos(campanhaId);
      const totalUnidades = lotes.reduce(
        (soma, item) => soma + Number(item.quantidade),
        0,
      );

      return res.status(200).json({ campanha, lotes, totalUnidades });
    } catch (error) {
      console.log(`Erro ao consultar detalhes da campanha: ${error}`);
      return res
        .status(error.status ?? 500)
        .json({ message: error.message ?? "Erro interno." });
    }
  };

  ListarLotesDisponiveis = async (req, res) => {
    try {
      const lotes = await this.#dao.ListarLotesDisponiveis();
      return res.status(200).json({ lotes });
    } catch (error) {
      console.log(`Erro ao listar lotes disponíveis: ${error}`);
      return res
        .status(error.status ?? 500)
        .json({ message: error.message ?? "Erro interno." });
    }
  };

  VincularLotes = async (req, res) => {
    try {
      const campanhaId = Number(req.params.id);
      if (!Number.isInteger(campanhaId) || campanhaId <= 0) {
        return res.status(400).json({ message: "Campanha inválida." });
      }

      const usuarioId = req.user?.id; // AJUSTE: veja a nota abaixo
      if (!usuarioId) {
        return res.status(401).json({ message: "Usuário não identificado." });
      }

      const { devolucaoLoteIds } = req.body;
      if (!Array.isArray(devolucaoLoteIds) || !devolucaoLoteIds.length) {
        return res
          .status(400)
          .json({ message: "Selecione pelo menos um lote." });
      }

      const ids = [...new Set(devolucaoLoteIds.map(Number))];
      if (ids.some((id) => !Number.isInteger(id) || id <= 0)) {
        return res.status(400).json({ message: "Lista de lotes inválida." });
      }

      const resultado = await this.#dao.VincularLotes({
        campanhaId,
        devolucaoLoteIds: ids,
        usuarioId,
      });

      return res.status(201).json(resultado);
    } catch (error) {
      console.log(`Erro ao vincular lotes: ${error}`);
      return res
        .status(error.status ?? 500)
        .json({ message: error.message ?? "Erro interno." });
    }
  };

  Listar = async (req, res) => {
    try {
      showLog("Listando campanhas");

      const campanhas = await this.#dao.Listar();

      if (campanhas === false) {
        return res
          .status(500)
          .json({ message: "Erro ao listar as campanhas." });
      }

      console.log(campanhas);

      res.status(200).json({ campanhas });
    } catch (error) {
      showLog(`Não foi possível listar as campanhas: ${error}`);
      res.status(500).json({
        message: `Erro ao listar as campanhas: ${error}`,
      });
    }
  };

  Excluir = async (req, res) => {
    try {
      showLog("Excluindo campanha...");

      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        return res.status(400).json({ message: "ID da campanha inválido." });
      }

      const resultado = await this.#dao.Excluir(id);

      if (resultado === "EM_USO") {
        return res.status(409).json({
          message:
            "A campanha está vinculada a outros registros e não pode ser excluída.",
        });
      }

      if (resultado === false) {
        return res.status(500).json({ message: "Erro ao excluir campanha." });
      }

      if (resultado === null) {
        return res.status(404).json({ message: "Campanha não encontrada." });
      }

      res.status(200).json({ message: "Campanha excluída com sucesso!" });
    } catch (error) {
      showLog(`Não foi possível excluir campanha: ${error}`);
      res.status(500).json({
        message: `Erro ao excluir campanha: ${error}`,
      });
    }
  };
}
