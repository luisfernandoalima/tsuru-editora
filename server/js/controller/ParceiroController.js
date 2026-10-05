import Parceiro from "../class/Parceiro.js";
import ParceiroDAO from "../dal/ParceiroDAO.js";

import Endereco from "../class/Endereco.js";
import EnderecoDAO from "../dal/EnderecoDAO.js";

import { documentValidator } from "../utils/documentValidator.js";

import CreditoController from "./CreditoController.js";

export default class ParceiroController {
  #dao;

  constructor() {
    this.#dao = new ParceiroDAO();
  }

  Criar = async (req, res) => {
    const { validateCNPJ } = documentValidator();

    try {
      const reqInfo = {
        nome: req.body.nome,
        cnpj: req.body.cnpj,
        email: req.body.email,
        contato: req.body.contato,
        ativo: true,
        data_cadastro: new Date(req.body.dataCadastro),
        enderecos: undefined,
      };

      const parceiro = new Parceiro(reqInfo);

      console.log(parceiro);

      if (!validateCNPJ(parceiro.getCnpj())) {
        console.log(`O CNPJ ${parceiro.getCnpj()} é inválido`);
      }

      if (await this.#dao.Criar(parceiro)) {
        return res.status(201).json({
          message: "Parceiro criado com sucesso!",
        });
      }
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        message: "Erro ao cadastrar Parceiro",
      });
    }
  };

  Consultar = async (req, res) => {
    try {
      const id = Number(req.params.id);

      const creditoController = new CreditoController();
      const enderecoDAO = new EnderecoDAO();

      const enderecos = [];

      const parceiro = new Parceiro(await this.#dao.Consultar(id));

      if (!parceiro) {
        return res.status(400).json({
          message: "Erro ao buscar Parceiro",
        });
      }

      const enderecosReq = await enderecoDAO.listarEndereco(id);

      console.log(enderecosReq);

      enderecosReq.forEach((item) => {
        const endereco = new Endereco(item);

        enderecos.push(endereco);
      });

      parceiro.setEnderecos(enderecos);

      const creditos = await creditoController.Consultar(id);

      return res.status(200).json({
        parceiro,
        creditos,
      });
    } catch (err) {
      console.log(err);

      return res.status(404).json({
        message: "Erro ao buscar Parceiro",
      });
    }
  };

  Alterar = async (req, res) => {
    try {
      const partnerId = Number(req.params.id);

      const parceiro = new Parceiro(await this.#dao.Consultar(partnerId));

      const { nome, cnpj, email, contato } = req.body;

      parceiro.setNome(nome);
      parceiro.setCnpj(cnpj);
      parceiro.setEmail(email);
      parceiro.setContato(contato);

      return res.status(200).json({
        message: "Atualização realizada com sucesso!",
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        message: "Erro ao atualizar Parceiro.",
      });
    }
  };

  Excluir = async (req, res) => {
    const { id } = req.params;

    try {
      await this.#dao.Excluir(Number(id));

      return res.status(200).json({
        message: "Parceiro excluído!",
      });
    } catch (err) {
      console.error(err);

      return res.status(400).json({
        message: "Parceiro não encontrado.",
      });
    }
  };

  Listar = async (req, res) => {
    try {
      const data = await this.#dao.Listar();

      if (!data) {
        return res.status(400).json({
          message: "Erro ao buscar Parceiros",
        });
      }

      const parceiros = [];

      data.forEach((item) => {
        parceiros.push(new Parceiro(item));
      });

      console.log("Listando");

      return res.status(200).json({
        parceiros,
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        message: "Erro ao buscar Parceiros",
      });
    }
  };

  pesquisarParceiros = async (req, res) => {
    const { pesquisa } = req.query;

    const parceiros = [];

    try {
      if (!pesquisa || pesquisa === undefined || pesquisa == "undefined") {
        return this.Listar(req, res);
      }

      if (typeof pesquisa !== "string") {
        return res.status(400).json({
          mensagem: "Pesquisa inválida",
        });
      }

      const parceirosDB = await this.#dao.pesquisarParceiros(pesquisa);

      console.log(parceirosDB);

      if (!parceirosDB) {
        return res.status(400).json({
          message: "Erro ao buscar usuário",
          type: "error",
        });
      }

      parceirosDB.forEach((item) => {
        parceiros.push(new Parceiro(item));
      });

      console.log(parceiros);

      return res.status(201).json({
        parceiros,
      });
    } catch (err) {
      return res.status(400).json({
        message: `Erro ao buscar Parceiros: ${err}`,
      });
    }
  };
}
