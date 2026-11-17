import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import JSZip from "jszip";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE = path.join(__dirname, "../templates/Relatorio_TSURU_V1.xlsx");

const MESES_ABREV = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];
const MESES_NOME = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

const LINHA_INICIAL = 30; // primeira linha da tabela "Resumo mensal"
const TOTAL_MESES = 6; // o template tem exatamente 6 linhas

const escXml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Localiza a célula <c r="REF" .../> ou <c r="REF" ...>...</c> (preserva o estilo "s")
const regexCelula = (ref) =>
  new RegExp(
    `<c r="${ref}"((?:\\s+[\\w:]+="[^"]*")*)\\s*(?:/>|>[\\s\\S]*?</c>)`,
  );

function atributoEstilo(attrs) {
  const m = attrs.match(/\ss="(\d+)"/);
  return m ? ` s="${m[1]}"` : "";
}

function setTexto(xml, ref, texto) {
  const re = regexCelula(ref);
  if (!re.test(xml))
    throw new Error(`Célula ${ref} não encontrada no template`);
  return xml.replace(
    re,
    (_, attrs) =>
      `<c r="${ref}"${atributoEstilo(attrs)} t="inlineStr"><is><t xml:space="preserve">${escXml(texto)}</t></is></c>`,
  );
}

function setNumero(xml, ref, valor) {
  const re = regexCelula(ref);
  if (!re.test(xml))
    throw new Error(`Célula ${ref} não encontrada no template`);
  return xml.replace(
    re,
    (_, attrs) =>
      `<c r="${ref}"${atributoEstilo(attrs)}><v>${Number(valor)}</v></c>`,
  );
}

// Fórmulas (SUM) são mantidas; só atualizamos o valor em cache
function setCacheFormula(xml, ref, valor) {
  const re = new RegExp(`(<c r="${ref}"[^>]*><f>[^<]*</f>)<v>[^<]*</v>`);
  if (!re.test(xml))
    throw new Error(`Fórmula em ${ref} não encontrada no template`);
  return xml.replace(re, `$1<v>${Number(valor)}</v>`);
}

// Reescreve o cache dos gráficos (o Excel recalcula ao abrir, mas previewers usam o cache)
function atualizarCacheGrafico(xml, valoresPorRef) {
  return xml.replace(
    /(<c:f>([^<]*)<\/c:f>)<c:(str|num)Cache>([\s\S]*?)<\/c:\3Cache>/g,
    (completo, tagF, ref, tipo, miolo) => {
      const novos = valoresPorRef[ref.replace(/\$/g, "")];
      if (!novos) return completo;

      const formato =
        miolo.match(/<c:formatCode>[\s\S]*?<\/c:formatCode>/)?.[0] ?? "";
      const pts = novos
        .map((v, i) => `<c:pt idx="${i}"><c:v>${escXml(v)}</c:v></c:pt>`)
        .join("");

      return `${tagF}<c:${tipo}Cache>${formato}<c:ptCount val="${novos.length}"/>${pts}</c:${tipo}Cache>`;
    },
  );
}

function textoPeriodo(primeiro, ultimo) {
  const nome = ({ ano, mes }) => `${MESES_NOME[mes - 1]} de ${ano}`;
  const inicio =
    primeiro.ano === ultimo.ano ? MESES_NOME[primeiro.mes - 1] : nome(primeiro);
  return `Período: ${inicio} a ${nome(ultimo)}   |   Quantidades em exemplares`;
}

/**
 * @param {Array<{ano:number, mes:number, entradas:number, saidas:number, doacoes:number}>} meses
 *        Exatamente 6 itens, em ordem cronológica.
 * @returns {Promise<Buffer>} arquivo .xlsx pronto para envio
 */
export default async function gerarRelatorioXlsx(meses) {
  if (!Array.isArray(meses) || meses.length !== TOTAL_MESES) {
    throw new Error(`O relatório exige exatamente ${TOTAL_MESES} meses.`);
  }

  const zip = await JSZip.loadAsync(await fs.readFile(TEMPLATE));
  const arquivoSheet = "xl/worksheets/sheet1.xml";
  let sheet = await zip.file(arquivoSheet).async("string");

  const rotulos = meses.map(
    (m) => `${MESES_ABREV[m.mes - 1]}/${String(m.ano).slice(-2)}`,
  );

  sheet = setTexto(sheet, "A4", textoPeriodo(meses[0], meses.at(-1)));

  meses.forEach((m, i) => {
    const linha = LINHA_INICIAL + i;
    sheet = setTexto(sheet, `A${linha}`, rotulos[i]);
    sheet = setNumero(sheet, `D${linha}`, m.entradas);
    sheet = setNumero(sheet, `G${linha}`, m.saidas);
    sheet = setNumero(sheet, `J${linha}`, m.doacoes);
  });

  const soma = (campo) => meses.reduce((t, m) => t + m[campo], 0);
  sheet = setCacheFormula(sheet, "A7", soma("saidas"));
  sheet = setCacheFormula(sheet, "E7", soma("entradas"));
  sheet = setCacheFormula(sheet, "I7", soma("doacoes"));

  const geradoEm = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });
  sheet = setTexto(sheet, "A37", `Gerado pelo sistema TSURU em ${geradoEm}.`);

  zip.file(arquivoSheet, sheet);

  const ultima = LINHA_INICIAL + TOTAL_MESES - 1;
  const intervalo = (col) => `Relatório!${col}${LINHA_INICIAL}:${col}${ultima}`;
  const caches = {
    [intervalo("A")]: rotulos,
    [intervalo("D")]: meses.map((m) => m.entradas),
    [intervalo("G")]: meses.map((m) => m.saidas),
    [intervalo("J")]: meses.map((m) => m.doacoes),
  };

  for (const arquivo of ["xl/charts/chart1.xml", "xl/charts/chart2.xml"]) {
    const xml = await zip.file(arquivo).async("string");
    zip.file(arquivo, atualizarCacheGrafico(xml, caches));
  }

  // Garante que o Excel recalcule tudo ao abrir
  const wbArquivo = "xl/workbook.xml";
  const wb = await zip.file(wbArquivo).async("string");
  zip.file(
    wbArquivo,
    wb.replace(/<calcPr([^>]*?)\/>/, '<calcPr$1 fullCalcOnLoad="1"/>'),
  );

  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}
