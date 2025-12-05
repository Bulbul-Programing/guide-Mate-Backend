import type { UserRole } from "../../types/UserRole";
import type { GuideArea } from "../guideArea/guideArea.interface";

export type TUser = {
    id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    profilePhoto?: string;
    bio?: string;
    language: string[];
}

export interface GuideProfile {
    id: string;
    userId: string;
    location: string;
    pricePerHour: number;
    isAvailable: boolean;
    experienceYears?: number;
}
