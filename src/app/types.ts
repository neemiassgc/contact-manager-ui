export interface Address {
	[index: string]: string,
  country: string,
  street: string,
  city: string,
  state: string,
  zipcode: string
}

interface StringType {
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