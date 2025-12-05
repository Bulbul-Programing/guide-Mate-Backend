import type { GuideProfile } from "../user/user.interface";

export interface GuideArea {
    id: string;
    guideId: string;
    name: string;
    description?: string;
    guide: GuideProfile;
}