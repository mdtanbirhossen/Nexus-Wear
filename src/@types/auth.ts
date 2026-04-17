
export interface IAuthType {
  token: string | null;
  expiresAt: number | null;
  id: string | null;
  email: string | null;
  image: string | null; // এই property টি যোগ করুন
  name?: string | null;
  role?: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    image?: string | null;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
  } | null;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginResponse {
  data: {
    id: string;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    name: string;
    email: string;
    phone: string;
    image: string | null;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  accessToken: string;
  message: string;
  status: string;
}

export interface IRegister {
  name: string;
  email: string;
  password: string;
}