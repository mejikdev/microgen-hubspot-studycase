import {
  FetchResult,
  MutationHookOptions,
  QueryHookOptions,
  QueryResult,
  useMutation,
  useQuery,
} from "@apollo/react-hooks"
import { gql } from "graphql-tag"

const query = {
  getCustomer: gql`
    query ($filter: CustomerFilter, $sort: CustomerOrderBy) {
      customers(where: $filter, orderBy: $sort) {
        id
        name
        email
        phoneNumber
        stage
        status
        updatedAt
        createdAt
        companies {
          id
          name
        }
      }
    }
  `,
  createCustomer: gql`
    mutation CreateCustomer($input: CreateCustomerInput!) {
      createCustomer(input: $input) {
        id
        name
        email
        phoneNumber
        createdAt
      }
    }
  `,
  updateCustomer: gql`
    mutation UpdateCustomer($id: String!, $input: UpdateCustomerInput!) {
      updateCustomer(id: $id, input: $input) {
        id
        name
        email
        phoneNumber
        createdAt
      }
    }
  `,
  deleteCustomer: gql`
    mutation DeleteCustomer($id: String!) {
      deleteCustomer(id: $id) {
        id
        name
        email
        phoneNumber
        createdAt
      }
    }
  `,
}

interface CustomerResult {
  customers: Customer[]
}

interface CustomerFilter extends Customer {
  createdById: string
}

interface CustomerQueryVariable {
  filter?: Partial<CustomerFilter>
  sort?: string
}

type CustomerQuery = QueryResult<CustomerResult, CustomerQueryVariable>

type CustomerMutation = {
  createCustomer: (options: MutationHookOptions) => Promise<FetchResult<{ createCustomer: Customer }>>
  updateCustomer: (options: MutationHookOptions) => Promise<FetchResult<{ updateCustomer: Customer }>>
  deleteCustomer: (options: MutationHookOptions) => Promise<FetchResult<{ deleteCustomer: Customer }>>
}

const useCustomerQuery = (options?: QueryHookOptions<CustomerResult, CustomerQueryVariable>): CustomerQuery => {
  return useQuery(query.getCustomer, options)
}

const useCustomerMutation = (): CustomerMutation => {
  const [createCustomer] = useMutation<{ createCustomer: Customer }>(query.createCustomer)
  const [updateCustomer] = useMutation<{ updateCustomer: Customer }>(query.updateCustomer)
  const [deleteCustomer] = useMutation<{ deleteCustomer: Customer }>(query.deleteCustomer)

  return {
    createCustomer,
    deleteCustomer,
    updateCustomer,
  }
}

export { useCustomerMutation, useCustomerQuery }
