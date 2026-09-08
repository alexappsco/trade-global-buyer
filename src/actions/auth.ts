"use server";

import { HOST_API } from "src/config-global";
import type {
  AuthAccountType,
  AuthRole,
  MyInfo,
  OtpChallenge,
  RegisterResponse,
  UserSession,
  VerifyResetOtpResponse,
} from "src/types/auth";

const AUTH_BASE = `${HOST_API}/auth`;

async function authRequest<T>(
  path: string,
  body?: unknown,
  lang?: string,
  accessToken?: string
): Promise<T> {
  const response = await fetch(`${AUTH_BASE}${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Accept-Language": lang ?? "en",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    const error = new Error(data?.message ?? `Request failed (${response.status})`);
    (error as Error & { status?: number }).status = response.status;
    (error as Error & { details?: unknown }).details = data?.details ?? null;
    throw error;
  }

  return data as T;
}

export interface RegisterPayload {
  role: AuthRole;
  type: AuthAccountType;
  name: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export async function registerAction(payload: RegisterPayload, lang?: string) {
  return authRequest<RegisterResponse>("/register", payload, lang);
}

export interface CompleteProfilePayload {
  completionToken: string;
  legalCompanyName: string;
  phoneNumber: string;
  email: string;
  sector: string;
  taxNumber: string;
  commercialRecord: string;
  city: string;
  companyAddress: string;
}

export async function completeProfileAction(payload: CompleteProfilePayload, lang?: string) {
  return authRequest<{
    userId: string;
    phoneNumber: string;
    registrationCompleted: boolean;
    nextStep: string;
  }>("/complete-profile", payload, lang);
}

export interface LoginPayload {
  role: AuthRole;
  phoneNumber: string;
  password: string;
}

export async function loginAction(payload: LoginPayload, lang?: string) {
  return authRequest<OtpChallenge>("/login", payload, lang);
}

export interface VerifyLoginOtpPayload {
  challengeId: string;
  phoneNumber: string;
  otp: string;
}

export async function verifyLoginOtpAction(payload: VerifyLoginOtpPayload, lang?: string) {
  return authRequest<UserSession>("/verify-login-otp", payload, lang);
}

export async function resendLoginOtpAction(
  payload: { challengeId: string; phoneNumber: string },
  lang?: string
) {
  return authRequest<OtpChallenge>("/resend-login-otp", payload, lang);
}

export async function forgetPasswordAction(phoneNumber: string, lang?: string) {
  return authRequest<OtpChallenge & { message?: string }>("/forget-password", { phoneNumber }, lang);
}

export async function verifyForgetPasswordOtpAction(
  payload: { challengeId: string; phoneNumber: string; otp: string },
  lang?: string
) {
  return authRequest<VerifyResetOtpResponse>("/verify-forget-password-otp", payload, lang);
}

export async function resendForgetPasswordOtpAction(
  payload: { challengeId: string; phoneNumber: string },
  lang?: string
) {
  return authRequest<OtpChallenge>("/resend-forget-password-otp", payload, lang);
}

export async function changePasswordAction(
  payload: { resetToken: string; newPassword: string; confirmPassword: string },
  lang?: string
) {
  return authRequest<void>("/change-password", payload, lang);
}

export async function refreshTokenAction(refreshToken: string, lang?: string) {
  return authRequest<UserSession>("/refresh-token", { refreshToken }, lang);
}

export async function logoutAction(refreshToken: string, lang?: string) {
  return authRequest<void>("/logout", { refreshToken }, lang);
}

export async function getMyInfoAction(accessToken: string, lang?: string) {
  return authRequest<MyInfo>("/my-info", undefined, lang, accessToken);
}
