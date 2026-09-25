interface IEndereco {
  id?: number;
  cep?: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
}

type TEndereco = {
  id?: number;
  text: string;
};

export default function formatAddress(enderecos: IEndereco[]) {
  let enderecosFormatados: TEndereco[] = [];

  enderecos.forEach((element) => {
    enderecosFormatados.push({
      id: element.id,
      text: `${element.logradouro}, ${element.bairro} - ${element.cidade}/${element.estado}, ${element.cep}`,
    });
  });

  return enderecosFormatados;
}
