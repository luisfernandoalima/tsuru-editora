export default function getPerfil(funcao: string) {
  let perfil = funcao === "ADMINISTRADOR" ? 1 : 2;

  return perfil;
}
