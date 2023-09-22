export interface ContactData {
  name: string
  phoneNumber: string
}

export interface FormType {
  firstName: string
  lastName?: string
  company?: string
  title?: string
  email?: string
  street: string
  city?: string
  state?: string
  zipcode?: string
  country?: string
  phoneNumber: string
  messageTemplate: string
}
