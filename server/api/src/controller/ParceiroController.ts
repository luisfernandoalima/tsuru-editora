import type { Request, Response } from "express";
import Parceiro from "../class/Parceiro.js";
import ParceiroDAO from "../dal/ParceiroDAO.js";
import type { IParceiro } from "../interfaces/IParceiro.js";

import Endereco from "../class/Endereco.js";
import EnderecoDAO from "../dal/EnderecoDAO.js";
import { documentValidator } from "../utils/documentValidator.js";
import type { IEndereco } from "../interfaces/IEndereco.js";

export default class ParceiroController {
  private dao: ParceiroDAO;

  constructor() {
    this.dao = new ParceiroDAO();
  }

  Criar = async (req: Request, res: Response) => {
    const { validateCNPJ } = documentValidator();

    try {
      const reqInfo: IParceiro = {
        nome: req.body.nome,
        cnpj: req.body.cnpj,
        email: req.body.email,
        contato: req.body.contato,
        ativo: true,
        data_cadastro: new Date(req.body.dataCadastro),
        enderecos: undefined,
      };

      const parceiro: Parceiro = new Parceiro(reqInfo);

      console.log(parceiro);

      if (!validateCNPJ(parceiro.getCnpj())) {
        console.log(`O CNPJ ${parceiro.getCnpj()} é inválido`);
      }

      if (await this.dao.Criar(parceiro)) {
        return res
          .status(201)
          .json({ message: "Parceiro criado com sucesso!" });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: "Erro ao cadastrar Parceiro" });
    }
  };
  Consultar = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      let enderecoDAO = new EnderecoDAO();
      let enderecos: Endereco[] = [];

      const parceiro = new Parceiro(await this.dao.Consultar(id));

      if (!parceiro) {
        return res.status(400).json({ message: "Erro ao buscar Parceiro" });
      }

      const enderecosReq: IEndereco[] = await enderecoDAO.Consultar(id);
      console.log(enderecosReq);

      enderecosReq.forEach((item) => {
        let endereco = new Endereco(item);

        enderecos.push(endereco);
      });

      parceiro.setEnderecos(enderecos);

      return res.status(200).json({ parceiro });
    } catch (err) {
      console.log(err);
      return res.status(404).json({ message: "Erro ao buscar Parceiro" });
    }
  };

  Alterar = async (req: Request, res: Response) => {
    try {
      const partnerId = Number(req.params.id);

      const parceiro = new Parceiro(await this.dao.Consultar(partnerId));

      const { nome, cnpj, email, contato } = req.body;

      parceiro.setNome(nome);
      parceiro.setCnpj(cnpj);
      parceiro.setEmail(email);
      parceiro.setContato(contato);

      return res
        .status(200)
        .json({ message: "Atualização realizada com sucesso!" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: "Erro ao atualizar Parceiro." });
    }
  };

  Excluir = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      await this.dao.Excluir(Number(id));

      return res.status(200).json({ message: "Parceiro excluído!" });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Parceiro não encontrado." });
    }
  };

  Listar = async (req: Request, res: Response) => {
    try {
      const data = await this.dao.Listar();

      if (!data) {
        return res.status(400).json({ message: "Erro ao buscar Parceiros" });
      }

      const parceiros: Parceiro[] = [];

      data.forEach((item) => {
        parceiros.push(new Parceiro(item));
      });

      return res.status(200).json({ parceiros });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: "Erro ao buscar Parceiros" });
    }
  };

  pesquisarParceiros = async (req: Request, res: Response) => {
    try {
      const reqInfo = String(req.params.name);
      console.log(reqInfo);

      if (!reqInfo) {
        return res.status(400).json({ message: "Erro ao buscar Parceiros" });
      }

      const parceirosDB = await this.dao.pesquisarParceiros(reqInfo);

      console.log(parceirosDB);

      if (!parceirosDB) {
        return res
          .status(400)
          .json({ message: "Erro ao buscar usuário", type: "error" });
      }

      const parceiros: Parceiro[] = [];

      parceirosDB.forEach((item) => {
        parceiros.push(new Parceiro(item));
      });

      return res.status(201).json({ parceiros });
    } catch (err) {
      return res
        .status(400)
        .json({ message: `Erro ao buscar Parceiros: ${err}` });
    }
  };
}
