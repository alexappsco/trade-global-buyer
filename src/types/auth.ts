export type AuthRole = "Buyer" | "Supplier";
export type AuthAccountType = "Company" | "Individual";

export interface OtpChallenge {
  challengeId: string;
  maskedPhone: string;
  expiresAt: string;
  resendsRemaining: number;
}

export interface RegisterResponse {
  id: string;
  phoneNumber: string;
  role: AuthRole;
  type: AuthAccountType;
  completionToken: string;
  completionTokenExpiresAt: string;
}

export interface UserSession {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  role: AuthRole;
  accessToken: string;
  refreshToken: string;
  accessTokenExpireAt: string;
  refreshTokenExpireAt: string;
  accountType: AuthAccountType;
  profileCompleted: boolean;
}

export interface MyInfo {
  name: string;
  email: string;
  phoneNumber: string;
  role: AuthRole;
  accountType: AuthAccountType;
  legalCompanyName: string;
  sector: string;
  taxNumber: string;
  commercialRecord: string;
  city: string;
  companyAddress: string;
  profileCompletedAt: string;
}

export interface VerifyResetOtpResponse {
  resetToken: string;
  expiresAt: string;
}

export type AuthFlowMode = "login" | "reset" | null;

export interface AuthFlowState {
  mode: AuthFlowMode | "register" | "changePassword";
  challengeId?: string;
  phoneNumber?: string;
  completionToken?: string;
  resetToken?: string;
}

export const ROLE_TO_UI: Record<AuthRole, "buyer" | "supplier"> = {
  Buyer: "buyer",
  Supplier: "supplier",
};

export const UI_TO_ROLE: Record<"buyer" | "supplier", AuthRole> = {
  buyer: "Buyer",
  supplier: "Supplier",
};
