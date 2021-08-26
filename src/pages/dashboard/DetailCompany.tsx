import "styles/detailCustomer.css"

import Icon from "@ant-design/icons"
import { CloseOutlined, ExclamationCircleOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Dropdown, List, Menu, Modal, PageHeader, Tabs, Typography } from "antd"
import { Phone } from "assets/icons/actions/index"
import Activity from "components/Activity"
import { useActivityQuery } from "hooks/activity"
import { useCompanyMutation, useCompanyQuery } from "hooks/company"
import React from "react"
import { Redirect, useHistory, useLocation, useParams } from "react-router-dom"

const { Text } = Typography
const { TabPane } = Tabs
const { confirm } = Modal

interface CustomerProps {
  user?: User
}

const defaultUser = {
  id: "",
  email: "Anonymouse@gmail.com",
  firstName: "anonymouse",
}

const DetailCompany = ({ user = defaultUser }: CustomerProps): JSX.Element => {
  const history = useHistory()
  const { companyId } = useParams<{ companyId: string }>()
  const { state } = useLocation<{ company: Company }>()
  const { company } = state

  const { deleteCompany, updateCompany } = useCompanyMutation()

  const { data: companies, refetch: refetchDataCompanies } = useCompanyQuery({
    variables: {
      filter: {
        id: companyId,
      },
    },
  })

  const { data, refetch, loading } = useActivityQuery({
    variables: {
      filter: {
        companyId,
      },
    },
  })

  React.useEffect(() => {
    refetch({
      filter: {
        companyId,
      },
    })
    refetchDataCompanies()
  }, [companyId, refetch, refetchDataCompanies])

  const handleDeleteAssociation = async (id: string) => {
    const newCompanies = Array.from(companies?.companies[0].customers || [])

    confirm({
      title: "Do you want to remove these association?",
      icon: <ExclamationCircleOutlined />,
      okType: "danger",
      async onOk() {
        await updateCompany({
          variables: {
            id: companyId,
            input: {
              customersIds: [...newCompanies.filter((item) => item.id !== id).map((item) => item.id)],
            },
          },
        })
          .then((response) => {
            refetchDataCompanies()
            refetch()
          })
          .catch((err) => {
            console.log(err)
          })
      },
    })
  }

  const handleDeleteCompany = (id: string) => {
    confirm({
      title: "Do you Want to delete these record?",
      icon: <ExclamationCircleOutlined />,
      okType: "danger",
      onOk() {
        deleteCompany({
          variables: {
            id,
          },
        }).then(() => {
          history.goBack()
        })
      },
    })
  }

  if (!state?.company) {
    return <Redirect to="/dashboard/contact" />
  }

  const TitleModal = (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "start" }}>
      <div
        style={{
          marginLeft: 5,
          display: "flex",
          alignItems: "start",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "left",
        }}
      >
        <Text style={{ width: "100%" }} className="header-subtitle">
          Company
        </Text>

        <Text className="header-title">{company.name}</Text>
        <Text className="header-title">{company.address}</Text>
      </div>
    </div>
  )

  const menu = (
    <Menu>
      <Menu.Item onClick={() => handleDeleteCompany(companyId)} key="0">
        Delete
      </Menu.Item>
    </Menu>
  )

  return (
    <div style={{ height: "100%", background: "#f1faf9", maxHeight: "100vh", overflowY: "hidden" }}>
      <PageHeader
        title={TitleModal}
        onBack={() => history.goBack()}
        extra={[
          <Dropdown key="more" overlay={menu} trigger={["click"]} placement="bottomCenter">
            <div key="save" className="btn-more">
              <MoreOutlined />
            </div>
          </Dropdown>,
        ]}
        style={{ background: "#fff" }}
      />
      <div className="detail-action">
        <div className="icon-actions">
          <a href={`tel:${company.phoneNumber}`}>
            <Icon component={Phone} onClick={() => console.log("click")} />
          </a>
          <Text>Call</Text>
        </div>
      </div>
      <Tabs defaultActiveKey="1" className="tab-list">
        <TabPane tab="Activity" key="1">
          <div style={{ padding: 20, marginTop: 10, overflowY: "auto", height: "calc(100vh - 15vh)" }}>
            <p style={{ marginBottom: 10 }}>Date</p>

            {loading
              ? "Loading ..."
              : data?.activities.map((activity) => (
                  <Activity
                    key={activity.id}
                    title={activity.title}
                    description={activity.desc}
                    createdAt={activity.createdAt}
                    style={{
                      width: "100%",
                      marginBottom: 10,
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "center",
                      flexDirection: "column",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                    }}
                  />
                ))}
          </div>
        </TabPane>
        <TabPane tab="Associations" key="2">
          <div style={{ overflowY: "auto", height: "calc(100vh - 15vh)" }}>
            <div style={{ padding: "3px 20px" }}>
              <Typography>Companies</Typography>
            </div>
            {companies?.companies[0].customers.length ? (
              <List
                bordered
                size="large"
                dataSource={companies?.companies[0].customers}
                renderItem={(item) => (
                  <List.Item
                    style={{ background: "#FFF" }}
                    actions={[
                      <Button
                        onClick={() => handleDeleteAssociation(item.id)}
                        style={{ border: "none" }}
                        key="list-loadmore-edit"
                        shape="circle"
                        icon={<CloseOutlined />}
                      />,
                    ]}
                  >
                    <Typography>{item.name}</Typography>
                  </List.Item>
                )}
              />
            ) : null}

            <div
              onClick={() =>
                history.push({
                  pathname: `/dashboard/company/association/${companyId}`,
                  state: { association: companies?.companies[0].customers },
                })
              }
              className="select-data-email"
              style={{ padding: "16px 24px", justifyContent: "space-between", cursor: "pointer" }}
              aria-hidden
            >
              <Text>Add contact</Text>
              <div style={{ border: "none", marginLeft: 24, padding: "0px 8px" }}>
                <Button style={{ border: "none" }} key="list-loadmore-edit" shape="circle" icon={<PlusOutlined />} />
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default DetailCompany
