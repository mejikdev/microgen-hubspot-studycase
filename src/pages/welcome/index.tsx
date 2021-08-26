import "styles/welcome.css"

import Icon from "@ant-design/icons"
import { RiseOutlined } from "@ant-design/icons"
import { Button, Layout, Tag, Typography } from "antd"
import { Logo } from "assets/icons"
import { UserQuery } from "hooks/user"
import * as React from "react"
import { useHistory } from "react-router-dom"

const { Header, Footer, Content } = Layout
const { Text, Paragraph } = Typography

const Welcome: React.FC = () => {
  const history = useHistory()
  const { data } = UserQuery()

  const authenticated = Boolean(data?.user?.id)

  React.useEffect(() => {
    if (authenticated) {
      return history.push("/dashboard")
    }
  }, [authenticated, history])

  return (
    <Layout className="layout-welcome">
      <Header style={{ color: "#FFF", backgroundColor: "#FFF" }}>
        <Icon component={Logo} />
      </Header>
      <Content className="container-content">
        <div className="wrap-text-1">
          <Text className="text-1">Content</Text>
          <Tag className="tag-text">Free</Tag>
        </div>
        <Paragraph className="paragraph-1">
          Automate data entry and manual tasks, gain visibility into your pipeline, and keep contacys organized so you
          can close more deals with less work.
        </Paragraph>
        <div className="wrap-text-bottom">
          <Paragraph className="paragraph-2" style={{ marginBottom: 0 }}>
            FREE versions of every HubSpot product.
          </Paragraph>
          <Paragraph className="paragraph-2" style={{ marginBottom: 0 }}>
            Start now and upgrade as you grow <RiseOutlined />
          </Paragraph>
        </div>
      </Content>
      <Footer className="footer-welcome">
        <Button className="button-default" onClick={() => history.push("/login")}>
          Log in
        </Button>
        <Button className="button-primary" onClick={() => history.push("/register")}>
          Sign up
        </Button>
      </Footer>
    </Layout>
  )
}

export default Welcome
