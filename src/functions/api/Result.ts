/**
 * Class representing the result of communication and/or computation. Expressed as a union of {Success} and {Failure}.
 */
export type Result<T, E> = Success<T> | Failure<E>;

/**
 * Class to represent successes of communication and/or computation
 */
export class Success<T> {
    readonly value: T;

    constructor(value: T) {
        this.value = value;
    }
    isSuccess(): this is Success<T> {
        return true;
    }
    isFailure(): this is Failure<unknown> {
        return false;
    }
}

/**
 * Class to represent failures of communication and/or computation
 */
export class Failure<E> {
    readonly error: E;

    constructor(error: E) {
        this.error = error;
    }
    isSuccess(): this is Success<unknown> {
        return false;
    }
    isFailure(): this is Failure<E> {
        return true;
    }
}