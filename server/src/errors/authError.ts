import { HttpError } from "./httpError";

export class AuthError extends HttpError {
    public static badNameOrPassword() {
        return new AuthError(400, "Wrong name or password");
    }

    public static nameAlreadyExists() {
        return new AuthError(400, "User with such name already exists");
    }

    public static emailAlreadyExists() {
        return new AuthError(400, "User with such email already exists");
    }

    public static unauthorized() {
        return new AuthError(401, "Please, sign in account");
    }
}
