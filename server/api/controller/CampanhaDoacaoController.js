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

  Consultar = async (req, res) => {
    try {
      showLog("Consultando campanha");

      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        return res.status(400).json({ message: "ID da campanha inválido." });
      }

      const campanha = await this.#dao.Consultar(id);

      if (campanha === false) {
        return res.status(500).json({ message: "Erro ao consultar campanha." });
      }

      if (campanha === null) {
        return res.status(404).json({ message: "Campanha não encontrada." });
      }

      res.status(200).json({ campanha });
    } catch (error) {
      showLog(`Não foi possível consultar a campanha: ${error}`);
      res.status(500).json({
        message: `Erro ao consultar campanha: ${error}`,
      });
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
