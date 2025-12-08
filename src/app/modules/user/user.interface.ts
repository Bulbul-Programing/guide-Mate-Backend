import type { TUserRole } from "../../types/UserRole";

export type TUser = {
    id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: TUserRole;
    profilePhoto?: string;
    bio?: string;
    isBlocked?: boolean;
    language: string[];
}

export type TGuideProfile = {
    userId?: string;
    location?: string;
    pricePerDay?: number;
    isAvailable?: boolean;
    experienceYears?: number;
}
