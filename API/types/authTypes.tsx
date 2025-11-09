import { Dayjs } from "dayjs";
export type DecodedJWTToken = {
  sub: string;
  exp: number;
};

export type SetCookieParams = {
  name: string;
  value: string;
  exp: number;
  path?: string;
  sameSite: "none" | "lax" | "strict";
  secure: boolean;
};

export type Gender = ["MALE", "FEMALE", "NOT_SPECIFIED"];
export type Abonnement = ["STARTER", "GROWTH", "PRO", null];
export type AbonnementDuration = ["monthly", "annual", null];
export type Role = "Member" | "Admin" | "Administrator" | "Staff";
export type RolesTypes = ["Member", "Admin", "Administrator", "Staff"];

export type Roles = RolesTypes[number];

export interface Business {
  id?: number;
  stripeAccountId?: string;
  name?: string;
  businessEmail: string;
  address?: string;
  city?: string;
  abonnement?: Abonnement;
  abonnementDuration?: AbonnementDuration;
  subscriptionValidUntil?: Dayjs | null;
  membersCount?: number;
}

export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  email: string;
  gender?: Gender;
  roles: Array<Roles>;
  birthDate?: Dayjs | null;
  createdAt?: Dayjs | null;
  updatedAt?: Dayjs | null;
  phone?: string;
  address?: string;
  city?: string;
}

export interface AdminDataRegister {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface DataForCardLinkStripe {
  connectedAccountId: string;
  returnUrl: string;
  refreshUrl: string;
}
