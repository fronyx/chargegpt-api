export class AddressOutOfScopeError {
    internalMessage: string;
    address: string;

    constructor(public message: string, originalAddress?: string) {
        this.internalMessage = message;
        this.address = originalAddress;
    }
}

export class AddressNotFoundError {
    internalMessage: string;
    address: string;
    constructor(public message: string, originalAddress?: string) {
        this.internalMessage = message;
        this.address = originalAddress;
    }
}