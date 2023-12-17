export enum ErrorType {
    NotFound,
    Forbidden,
    Unknown,
}

export interface Error {
    type: ErrorType,
    message?: string,
}