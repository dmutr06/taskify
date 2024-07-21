import { Handler, NextFunction, Response } from "express";
import { sign, verify, JwtPayload } from "jsonwebtoken";
import { AuthError } from "../errors/authError";
import { UserRequest } from "./customRequest";


export const auth = (name: string, secret: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        sign(
            {
                name,
                iat: Math.floor(Date.now() / 1000),
            },
            secret,
            {
                algorithm: "HS256",
            },
            (err, token) => {
                if (err)
                    reject(err);

                resolve(token as string);
            },
        );
    });
};

export const authMiddleware: Handler = <T>(req: UserRequest<T>, _res: Response, next: NextFunction) => {
    if (!req.headers.authorization)
        throw AuthError.unauthorized();

    verify(req.headers.authorization.split(" ")[1], process.env.SECRET!, (err, payload) => {
        if (err || !payload)
            throw AuthError.unauthorized(); 

        req.user = (payload as JwtPayload).name;
        next();
    });
}
