export type AuthRole = "Buyer" | "Supplier";
export type AuthAccountType = "Company" | "Individual";

export interface CategoryInfo {
  code: string;
  nameEn: string;
  nameAr: string;
}

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

export interface CompleteProfileResponse {
  userId: string;
  phoneNumber: string;
  registrationCompleted: boolean;
  nextStep: string;
}

/**
 * Public, non-sensitive session data that is safe to expose to the client.
 * Tokens are intentionally excluded — they live only in httpOnly cookies.
 */
export interface SessionMeta {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  avatarUrl?: string;
  role: AuthRole;
  accountType: AuthAccountType;
  profileCompleted: boolean;
  accessTokenExpireAt: string;
  refreshTokenExpireAt: string;
}

/** Server-only session including the auth tokens (never sent to the client). */
export interface UserSession extends SessionMeta {
  accessToken: string;
  refreshToken: string;
}

export interface MyInfo {
  name: string;
  email: string;
  phoneNumber: string;
  role: AuthRole;
  accountType: AuthAccountType;
  legalCompanyName: string;
  categories: CategoryInfo[];
  taxNumber: string;
  commercialRecord: string;
  city: string;
  companyAddress: string;
  profileCompletedAt: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
}

export interface UpdateMyInfoPayload {
  name: string;
  legalCompanyName: string;
  phoneNumber: string;
  email: string;
  categoryCodes: string[];
  taxNumber: string;
  commercialRecord: string;
  city: string;
  companyAddress: string;
  profileImage?: File | null;
  coverImage?: File | null;
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
