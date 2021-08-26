import { FetchResult, MutationHookOptions, useMutation } from "@apollo/react-hooks"
import gql from "graphql-tag"

const query = {
  login: gql`
    mutation login($input: LoginInput) {
      login(input: $input) {
        token
        user {
          id
          firstName
        }
      }
    }
  `,
  register: gql`
    mutation register($input: RegisterInput) {
      register(input: $input) {
        token
        user {
          id
          firstName
        }
      }
    }
  `,
}

type MutationLogin = (options: MutationHookOptions) => Promise<FetchResult<{ login: ResponseLogin }>>
type MutationRegister = (options: MutationHookOptions) => Promise<FetchResult<{ register: ResponseRegister }>>

const useLogin = (): MutationLogin => {
  const [login] = useMutation<{ login: ResponseLogin }>(query.login)
  return login
}

const useRegister = (): MutationRegister => {
  const [register] = useMutation<{ register: ResponseRegister }>(query.register)
  return register
}

export { useLogin, useRegister }
