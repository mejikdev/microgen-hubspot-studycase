import "styles/login.css"

import Icon from "@ant-design/icons"
import { Button, Form, Input, Layout, Typography } from "antd"
import { Logo } from "assets/icons"
import { useLogin } from "hooks/auth"
import { UserQuery } from "hooks/user"
import { setCookie } from "nookies"
import * as React from "react"
import { useHistory } from "react-router-dom"

const { Link, Text } = Typography
const { Header, Footer, Content } = Layout

const Login: React.FC = () => {
  const login = useLogin()
  const { data } = UserQuery()
  const history = useHistory()

  const [value, setValue] = React.useState({
    email: "",
    password: "",
  })

  const [loading, setLoading] = React.useState(false)

  const disabled = !value.email || !value.password || loading
  const authenticated = Boolean(data?.user?.id)

  React.useEffect(() => {
    if (authenticated) {
      return history.push("/dashboard")
    }
  }, [authenticated, history])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue((previous) => ({ ...previous, [e.target.name]: e.target.value }))
  }

  const handleLogin = (values: React.FormEvent) => {
    setLoading(true)
    login({
      variables: {
        input: values,
      },
    })
      .then((response) => {
        const token: string = response.data?.login?.token as string

        setCookie(null, "token", token, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        })

        window.location.replace("/dashboard")
        setLoading(false)
      })
      .catch(() => {
        alert("Invalid Login")
        setLoading(false)
      })
  }

  return (
    <Layout className="layout-login">
      <Header className="header-login">
        <Icon component={Logo} />
      </Header>
      <Content className="container-content-login">
        <h1>Create your free account</h1>

        <Form className="login-page-form" onFinish={handleLogin}>
          <Form.Item name="email" rules={[{ required: true, message: "Email" }]}>
            <Input
              className="input-form-login"
              placeholder="Email"
              name="email"
              value={value.email}
              onChange={onChange}
            />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: "Password" }]}>
            <Input
              className="input-form-login"
              type="password"
              placeholder="Password"
              name="password"
              value={value.password}
              onChange={onChange}
            />
          </Form.Item>
          <Form.Item>
            <Button disabled={disabled} htmlType="submit" className="button-primary-register">
              {loading ? "Login..." : "Login"}
            </Button>
          </Form.Item>
        </Form>
      </Content>
      <Footer className="footer-login">
        <Text>You have account?</Text>
        <Link href="/register" className="button-signin">
          Register
        </Link>
      </Footer>
    </Layout>
  )
}

export default Login
