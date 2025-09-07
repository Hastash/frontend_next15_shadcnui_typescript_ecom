export interface EditableRef {
  cancel: () => void;
}

export type StrapiErrorT = {
  data: null;
  error: {
    status: number;
    name: string;
    message: string;
  };
};

export type StrapiLoginResponseT = {
  jwt: string;
  user: any;
};

// Credentials for authentication
export type Credentials = {
  username?: string;
  email?: string;
  identifier?: string;
  currentPassword?: string;
  password?: string;
  confirmPassword?: string;
  newPassword?: string;
  code?: string;
};

// Form state for form handling and server actions
export type FormState = {
  errors: Credentials;
  values: Credentials;
  message?: string;
  success?: boolean;
};

export type SessionPayload = {
  user?: any;
  expiresAt?: Date;
  jwt?: string;
};


export type PartialWithRequired<T, K extends keyof T> = Partial<Omit<T, K>> &
  Pick<T, K>;