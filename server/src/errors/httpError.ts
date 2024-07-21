
export class HttpError {
    public readonly status: number;
    public readonly message: string;

    constructor(status: number, message: string) {
        this.status = status;
        this.message = message;
    }

    public static smthingWentWrong() {
        return new HttpError(404, "Something went wrong...");
    }

    public static badRequest() {
        return new HttpError(400, "Bad request");
    }
} 
