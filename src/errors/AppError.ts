export class AppError extends Error {
    public readonly statusCode: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = "AppError";
        this.statusCode = status;
    }

}
