import Endereco from "../class/Endereco.js";
import EnderecoDAO from "../dal/EnderecoDAO.js";

export default class EnderecoController {
  #dao = new EnderecoDAO();

  Criar = async (req, res) => {
    try {
      const partnerId = Number(req.params.id);

      const reqInfo = {
        cep: req.body.cep,
        logradouro: req.body.logradouro,
        numero: req.body.numero,
        bairro: req.body.bairro,
        cidade: req.body.cidade,
        estado: req.body.estado,
      };

      const endereco = new Endereco(reqInfo);

      console.log("Id do parceiro: " + req.body.parceiroId);
      console.log(endereco);

      const response = await this.#dao.Criar(endereco, partnerId);

      if (response) {
        return res.status(201).json({
          message: "Endereço cadastrado!",
        });
      }
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        message: error,
      });
    }
  };

  Excluir = async (req, res) => {
    try {
      const adressId = req.params.id;

      if (!(await this.#dao.Excluir(Number(adressId)))) {
        return res.status(400).json({
          message: "Erro ao excluir usuário",
          type: "error",
        });
      }

      return res.status(201).json({
        message: "Usuário excluído!",
        type: "success",
      });
    } catch (error) {
      console.log(`${error}`);

      return res.status(400).json({
        message: "Erro ao excluir endereço",
      });
    }
  };
}
