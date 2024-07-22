export interface Address {
	[index: string]: string,
  country: string,
  street: string,
  city: string,
  state: string,
  zipcode: string
}

export interface StringType {
  [propName: string]: string
}

export interface AddressType {
	[propName: string]: Address
}

export interface Contact {
  id: string,
  name: string,
  phoneNumbers: StringType,
  addresses: AddressType,
  emails: StringType
}

export class ErrorType extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ViolationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export interface ShortContact {
  [field: string]: string,
  name: string,
  phoneLabel: string,
  phoneValue: string
}

export type Severity = "success" | "error" | "info" | "warning"

export type Run = () => void;

export type ShowAlertFunc = (msg: string, severity?: Severity) => void;