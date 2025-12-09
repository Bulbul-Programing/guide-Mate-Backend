export type TUserRole = 'TRAVELER' | 'GUIDE' | 'ADMIN';

export type TDecodedUser = {
    email: string,
    userId: string,
    role: TUserRole
}