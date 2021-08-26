interface User {
  id: string
  email: string
  firstName: string
}

interface Message {
  id: string
  data: string
  createdBy: User
}

interface ResponseLogin {
  token: string
  user: User
}

interface ResponseRegister {
  token: string
  user: User
}

interface Customer {
  id: string
  email: string
  name: string
  phoneNumber: string
  stage: string
  status: string
  updatedAt: string
  companies?: {
    id: string
    name: string
  }[]
}

interface Company {
  id: string
  name: string
  address?: string
  phoneNumber?: string
  customers: {
    id: string
    name: string
  }[]
}

interface Activity {
  id: string
  title: string
  desc?: string
  createdAt: string
}
interface ValueFormCustomer {
  name: string
  phoneNumber: string
  email: string
  prefix?: string
}
