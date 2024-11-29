// FE\UI\src\app\shared\types\google-types.ts
declare global {
  interface Window {
    google: any;
  }
}

export interface GoogleCredentialResponse {
  credential: string;
}

export interface GoogleUserPayload {
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export interface GoogleAuthResponse {
  token: string;
  user: {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
  }
}
