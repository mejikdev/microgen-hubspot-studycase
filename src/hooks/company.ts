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
  getCompanies: gql`
    query getCompanies($filter: CompanyFilter, $sort: CompanyOrderBy) {
      companies(where: $filter, orderBy: $sort) {
        id
        name
        address
        phoneNumber
        createdAt
        customers {
          id
          name
        }
      }
    }
  `,
  createCompany: gql`
    mutation createCompany($input: CreateCompanyInput!) {
      createCompany(input: $input) {
        id
        name
        address
        phoneNumber
        createdAt
      }
    }
  `,
  updateCompany: gql`
    mutation updateCompany($id: String!, $input: UpdateCompanyInput!) {
      updateCompany(id: $id, input: $input) {
        id
        name
        address
        phoneNumber
        createdAt
      }
    }
  `,
  deleteCompany: gql`
    mutation deleteCompany($id: String!) {
      deleteCompany(id: $id) {
        id
        name
        address
        phoneNumber
        createdAt
      }
    }
  `,
}

interface CompanyResult {
  companies: Company[]
}

interface CompanyFilter extends Company {
  createdById: string
}

interface CompanyQueryVariables {
  filter?: Partial<CompanyFilter>
  sort?: string
}

type CompanyQuery = QueryResult<CompanyResult, CompanyQueryVariables>

type CompanyMutation = {
  createCompany: (options: MutationHookOptions) => Promise<FetchResult<{ createCompany: Company }>>
  updateCompany: (options: MutationHookOptions) => Promise<FetchResult<{ updateCompany: Company }>>
  deleteCompany: (options: MutationHookOptions) => Promise<FetchResult<{ deleteCompany: Company }>>
}

const useCompanyQuery = (options?: QueryHookOptions<CompanyResult, CompanyQueryVariables>): CompanyQuery => {
  return useQuery(query.getCompanies, options)
}

const useCompanyMutation = (): CompanyMutation => {
  const [createCompany] = useMutation<{ createCompany: Company }>(query.createCompany)
  const [updateCompany] = useMutation<{ updateCompany: Company }>(query.updateCompany)
  const [deleteCompany] = useMutation<{ deleteCompany: Company }>(query.deleteCompany)

  return {
    createCompany,
    deleteCompany,
    updateCompany,
  }
}

export { useCompanyMutation, useCompanyQuery }
