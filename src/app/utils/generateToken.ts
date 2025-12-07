import jwt, { Secret, SignOptions } from "jsonwebtoken";

export const generateToken = (tokenPayload: any, secret: Secret, expireIn: string) => {
    const token = jwt.sign(tokenPayload, secret, { expiresIn: expireIn, algorithm: "HS256", } as SignOptions)
    return token;
}