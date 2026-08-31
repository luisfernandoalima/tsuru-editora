import type { Request, Response } from "express";
import Endereco from "../class/Endereco.js";
import type { IEndereco } from "../interfaces/IEndereco.js";
import EnderecoDAO from "../dal/EnderecoDAO.js";

export default class EnderecoController {
  dao = new EnderecoDAO();

  Criar = async (req: Request, res: Response) => {
    try {
      const reqInfo: IEndereco = {
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

      await this.dao.Criar(endereco);

      return res.status(201).json({ message: "Endereço cadastrado!" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Erro no cadastro do endereço" });
    }
  };
}
