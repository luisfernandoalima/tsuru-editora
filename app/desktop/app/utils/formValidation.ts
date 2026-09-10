import type { LoginUser } from "./../types/User";
import type { TPassword } from "./../types/User";

type Error = {
  [key: string]: string;
};

export const formValidation = () => {
  function validateLogin(data: LoginUser) {
    const errors: Error = {};

    if (!data.email) errors["email"] = "O e-mail é obrigatório";
    if (!data.password) errors["password"] = "A senha é obrigatória";

    return errors;
  }

  function validatePassword(data: TPassword) {
    const errors: Error = {};

    if (!data.password) errors["password"] = "A senha é obrigatória.";
    if (!data.repeatPassword)
      errors["repeatPassword"] = "É obrigatório repetir a senha.";
    if (data.password != data.repeatPassword)
      errors["diferentPassword"] = "As senhas não são iguais";

    return errors;
  }

  return { validateLogin, validatePassword };
};
