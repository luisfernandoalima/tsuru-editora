import { Router } from "express";

import authValidate from "../middlewares/auth.js";
import createUpload from "../middlewares/imageUpload.js";

import { v4 as uuidv4 } from "uuid";

import UserController from "../controller/UserController.js";
import ProdutoController from "../controller/ProductController.js";
import EntradaController from "../controller/EntradaController.js";
import SaidaController from "../controller/SaidaController.js";
import OrdemDeImpressaoController from "../controller/OrdemDeImpressaoController.js";
import EnderecoController from "../controller/EnderecoController.js";
import ParceiroController from "../controller/ParceiroController.js";

const route = Router();
const userController = new UserController();
const produtoController = new ProdutoController();
const entradaController = new EntradaController();
const saidaController = new SaidaController();
const enderecoController = new EnderecoController();
const parceiroController = new ParceiroController();
const ordemDeImpressaoController = new OrdemDeImpressaoController();

route.post("/user/sign-up", userController.Criar);
route.post("/user/login", userController.Login);
route.get("/user/find-user/:id", authValidate, userController.Consultar);
route.patch("/user/update", authValidate, userController.Alterar);
route.delete("/user/delete/:id", authValidate, userController.Excluir);
route.patch(
  "/user/update-password",
  authValidate,
  userController.atualizarSenha,
);
route.get("/user/list-users", authValidate, userController.listarUsuarios);
route.get(
  "/user/list-by-name/:name",
  authValidate,
  userController.listarUsuariosPorNome,
);

route.post(
  "/product/create",
  authValidate,
  createUpload(uuidv4()).single("imgCapa"),
  produtoController.Criar,
);
route.get("/product/find-product/:id", produtoController.Consultar);
route.patch("/product/update/:id", authValidate, produtoController.Alterar);
route.delete("/product/delete/:id", authValidate, produtoController.Excluir);
route.get(
  "/product/list-products",
  authValidate,
  produtoController.listarProdutos,
);
route.get("/product/search", authValidate, produtoController.pesquisarProduto);
route.get(
  "/product/list-by-name/:produto",
  authValidate,
  produtoController.listarPorNome,
);

route.post("/entry/register", authValidate, entradaController.Registrar);
route.get(
  "/entry/find-registration/:cupom",
  authValidate,
  entradaController.Consultar,
);
route.get("/entry/list-registration", authValidate, entradaController.Listar);
route.get(
  "/entry/list-registration-cupom/:cupom",
  authValidate,
  entradaController.listarPorCupom,
);

// Registro de saídas
route.post("/outgoing/register", authValidate, saidaController.Registrar);
route.get(
  "/outgoing/find-registration/:cupom",
  authValidate,
  saidaController.Consultar,
);
route.get("/outgoing/list-registration", authValidate, saidaController.Listar);
route.get(
  "/outgoing/list-registration-cupom/:cupom",
  authValidate,
  saidaController.listarPorCupom,
);

// registro de ordens
route.post(
  "/print-order/create",
  authValidate,
  ordemDeImpressaoController.Criar,
);
route.get("/print-order/list", authValidate, ordemDeImpressaoController.Listar);
route.put(
  "/print-order/update/:id",
  authValidate,
  ordemDeImpressaoController.Alterar,
);
route.get(
  "/print-order/:id",
  authValidate,
  ordemDeImpressaoController.Consultar,
);
route.put(
  "/print-order/approve/:id",
  authValidate,
  ordemDeImpressaoController.Aprovar,
);
route.put(
  "/print-order/reject/:id",
  authValidate,
  ordemDeImpressaoController.Rejeitar,
);
route.get(
  "/print-order/search",
  authValidate,
  ordemDeImpressaoController.Buscar,
);
route.post(
  "/print-order/save-products/:id",
  authValidate,
  ordemDeImpressaoController.salvarProdutos,
);

route.post("/partner/new-partner", authValidate, parceiroController.Criar);
route.get("/partner/list", authValidate, parceiroController.Listar);
route.get("/partner/view/:id", authValidate, parceiroController.Consultar);
route.patch("/partner/edit/:id", authValidate, parceiroController.Alterar);

route.post("/partner/new-adress/:id", authValidate, enderecoController.Criar);

export default route;
