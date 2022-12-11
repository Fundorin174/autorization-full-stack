interface User {
  id: number;
  email: string;
  password: string;
  isActivated: boolean;
  activationLink: string;
  name: string;
  surname: string;
}

interface Token {
  refreshToken: string;
  userId: string;
}

type TokenPayload = {
  [key: string]: number | string | Date | boolean;
};

export {
  type User,
  type Token,
  type TokenPayload,
}