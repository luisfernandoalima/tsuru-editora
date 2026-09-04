export type LoginUser = {
  email: string;
  password: string;
};

export interface TokenPayload {
  id: number;
  email: string;
  funcao: string;
}
