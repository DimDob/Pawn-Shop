/**
 * The interface transfers user data from the UI
 */
export interface PrismData {
    prismTransform?: string;
  administratorEmail?: string;
  loginUsername: string ;
  loginPassword: string;
  forgotPasswordEmail?: boolean;
  signupEmail?: string;
  signupPassword?: string;
  signupPassword2?: string;
  contactName?: string;
  contactEmail?: string;
  contactMessage?: string;
  showingThankYou?: string;
  forgotPassword?: boolean
}