import type { TUserRole } from "../../types/UserRole";
import type { GuideArea } from "../guideArea/guideArea.interface";

export type TUser = {
    id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: TUserRole;
    profilePhoto?: string;
    bio?: string;
    language: string[];
}

export type TGuideProfile = {
    id: string;
    userId: string;
    location: string;
    pricePerHour: number;
    isAvailable: boolean;
    experienceYears?: number;
}
