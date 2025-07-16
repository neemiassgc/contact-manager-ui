export type Props = {
  value: string,
  error?: string | undefined
}

export type Marker = { marker: Props }

export type StringField = Marker & { field: Props }

export type AddressField = Marker & { field: { value: Address, error?: Partial<Address> | undefined } }

export interface Address {
  [index: string]: string,
  country: string,
  street: string,
  city: string,
  state: string,
  zipcode: string
}

export type Variant = "success" | "error" | "warning";

export interface IndexedString {
  [propName: string]: string
}

export interface IndexedAddress {
  [propName: string]: Address
}

export interface Contact {
  name: string,
  addedOn: string,
  birthday?: string,
  phoneNumbers: IndexedString,
  addresses: IndexedAddress,
  emails: IndexedString
}

export interface ContactTableRow {
  id: string,
  name: string,
  phone: string,
  email: string,
  company: string,
  role: string,
}

export type ContactWithId = Contact & { id: string };

type MapContact<Type> = {
  [Property in keyof Type]: Type[Property] extends string ? Props : Type[Property] extends IndexedString ? StringField[] : AddressField[];
};

export type MappedContact = MapContact<Contact>;

export type DrawerType = "Create" | "Edit";