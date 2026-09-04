function calcularDigito(base: string, pesoInicial: number): string {
  let soma = 0;
  let peso = pesoInicial;

  for (const char of base) {
    soma += parseInt(char, 10) * peso;
    peso--;
  }

  const resto = soma % 11;
  return resto < 2 ? "0" : String(11 - resto);
}

function calculaDigitoCNPJ(base: string, pesos: number[]): string {
  const soma = base
    .split("")
    .reduce((acc, char, i) => acc + parseInt(char, 10) * (pesos[i] ?? 0), 0);

  const resto = soma % 11;
  return resto < 2 ? "0" : String(11 - resto);
}

export const documentValidator = (request: string) => {
  function validaCPF() {
    const numerosCPF = request.replaceAll(".", "").replace("-", "");

    if (numerosCPF.length !== 11 || /^(\d)\1{10}$/.test(numerosCPF)) {
      return false;
    }

    const d1 = calcularDigito(numerosCPF.slice(0, 9), 10);
    const d2 = calcularDigito(numerosCPF.slice(0, 9) + d1, 11);

    console.log("CPF Validado");
    return numerosCPF.slice(-2) === d1 + d2;
  }

  function validaCNPJ() {
    const numeros = request
      .replaceAll(".", "")
      .replace("-", "")
      .replace("/", "");

    if (numeros.length !== 14 || /^(\d)\1{13}$/.test(numeros)) {
      return false;
    }

    const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const pesos2 = [6, ...pesos1];

    const d1 = calculaDigitoCNPJ(numeros.slice(0, 12), pesos1);
    const d2 = calculaDigitoCNPJ(numeros.slice(0, 12) + d1, pesos2);

    return numeros.slice(-2) === d1 + d2;
  }
  return { validaCPF, validaCNPJ };
};
