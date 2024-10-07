export interface Address {
	[index: string]: string,
  country: string,
  street: string,
  city: string,
  state: string,
  zipcode: string
}

export interface IndexedString {
  [propName: string]: string
}

export interface IndexedAddress {
	[propName: string]: Address
}

export interface Contact {
  id: string,
  name: string,
  phoneNumbers: IndexedString,
  addresses: IndexedAddress,
  emails: IndexedString
}

export class ErrorType extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ViolationError extends Error {
  private content: object;

  constructor(content: object, message?: string) {
    super(message);
    this.content = content;
  }

  getContentAsFieldViolations(): FieldViolations {
    return this.content as FieldViolations;
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

export interface CountryCode {
  name: string,
  dial_code: string,
  code: string
}

export interface ModalType {
  open: boolean,
  isLoading: boolean,
  title: string,
  handleClose: Run,
  handleAccept: Run
}

export interface FieldViolations {
  fieldViolations: Violations
}

export interface Violations {
  [fieldName: string]: string[] | undefined
}