export type LoginUser = {
  email: string;
  password: string;
};

export type TPassword = {
  password: string;
  repeatPassword: string;
};

export interface TokenPayload {
  id: number;
  email: string;
  funcao: string;
}
