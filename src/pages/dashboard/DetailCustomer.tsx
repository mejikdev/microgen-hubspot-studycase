import "styles/detailCustomer.css"

import Icon from "@ant-design/icons"
import { CloseOutlined, ExclamationCircleOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Dropdown, List, Menu, Modal, PageHeader, Tabs, Typography } from "antd"
import { Chat, Msg, Phone } from "assets/icons/actions/index"
import Activity from "components/Activity"
import BasicList from "components/detail-contact/BasicList"
import SelectList from "components/detail-contact/SelectList"
import { useActivityQuery } from "hooks/activity"
import { useCustomerMutation, useCustomerQuery } from "hooks/customer"
import moment from "moment"
import { MenuInfo } from "rc-menu/lib/interface"
import React from "react"
import { Redirect, useHistory, useLocation, useParams } from "react-router-dom"

const { Text } = Typography
const { TabPane } = Tabs
const { confirm } = Modal

interface IGroupedActivity<T> {
  key: string
  data: T
}
interface BaseData {
  createdAt: string
}
interface CustomerProps {
  user?: User
}

const defaultUser = {
  id: "",
  email: "Anonymouse@gmail.com",
  firstName: "anonymouse",
}

const DetailCustomer = ({ user = defaultUser }: CustomerProps): JSX.Element => {
  const [groupActivity, setGroupActivity] = React.useState<IGroupedActivity<Activity[]>[]>()

  const history = useHistory()
  const { customerId } = useParams<{ customerId: string }>()
  const { state } = useLocation<{ customer: Customer }>()
  const { customer } = state

  const { data: dataCustomers, refetch: refetchDataQustomers } = useCustomerQuery({
    variables: {
      filter: {
        id: customerId,
      },
    },
  })

  const { data, refetch, loading } = useActivityQuery({
    variables: {
      filter: {
        customerId,
      },
    },
  })

  const { deleteCustomer, updateCustomer } = useCustomerMutation()

  React.useEffect(() => {
    refetch({
      filter: {
        customerId,
      },
    })
    refetchDataQustomers()
  }, [customerId, refetch, refetchDataQustomers])

  React.useEffect(() => {
    if (data?.activities.length) {
      const groupActivity = groupDateActivity(data.activities)
      if (groupActivity) {
        const newData = Object.keys(groupActivity).map((key) => ({ key, data: groupActivity[key] }))
        setGroupActivity(newData)
      }
      return
    }
    setGroupActivity([])
  }, [data])

  function groupDateActivity<Type extends BaseData>(data: Type[]) {
    return data?.reduce<{ [key: string]: Type[] }>((groups, game) => {
      const date = `${game.createdAt.split("-")[0]}-${game.createdAt.split("-")[1]}`

      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(game)
      return groups
    }, {})
  }

  if (!state?.customer) {
    return <Redirect to="/dashboard/contact" />
  }

  const handleChangeStatus = async ({ key }: MenuInfo) => {
    await updateCustomer({
      variables: {
        id: customerId,
        input: {
          status: key,
        },
      },
    })
      .then((response) => {
        refetchDataQustomers()
        refetch()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleChangeStage = async ({ key }: MenuInfo) => {
    await updateCustomer({
      variables: {
        id: customerId,
        input: {
          stage: key,
        },
      },
    })
      .then((response) => {
        refetchDataQustomers()
        refetch()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleDeleteAssociation = async (id: string) => {
    const newCustomer = Array.from(dataCustomers?.customers[0].companies || [])

    confirm({
      title: "Do you want to remove these association?",
      icon: <ExclamationCircleOutlined />,
      okType: "danger",
      async onOk() {
        await updateCustomer({
          variables: {
            id: customerId,
            input: {
              companiesIds: [...newCustomer.filter((item) => item.id !== id).map((item) => item.id)],
            },
          },
        })
          .then((response) => {
            refetchDataQustomers()
            refetch()
          })
          .catch((err) => {
            console.log(err)
          })
      },
    })
  }

  const handleDeleteCustomer = (id: string) => {
    confirm({
      title: "Do you Want to delete these record?",
      icon: <ExclamationCircleOutlined />,
      okType: "danger",
      onOk() {
        deleteCustomer({
          variables: {
            id,
          },
        }).then(() => {
          history.goBack()
        })
      },
    })
  }

  const TitleModal = (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "start" }}>
      <div
        style={{
          marginLeft: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "left",
        }}
      >
        <Text style={{ width: "100%" }} className="header-subtitle">
          Contact
        </Text>

        <Text className="header-title">{customer.name}</Text>
      </div>
    </div>
  )

  const menu = (
    <Menu>
      <Menu.Item onClick={() => handleDeleteCustomer(customerId)} key="0">
        Delete
      </Menu.Item>
    </Menu>
  )

  return (
    <div style={{ height: "100%", maxHeight: "100vh", background: "#f1faf9", overflow: "hidden" }}>
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
          <a href={`tel:${customer.phoneNumber}`}>
            <Icon component={Phone} onClick={() => console.log("click")} />
          </a>
          <Text>Call</Text>
        </div>
        <div className="icon-actions">
          <a href="/dashboard/customer/send-email" onClick={(e) => e.preventDefault()}>
            <Icon
              component={Msg}
              onClick={() =>
                history.push({
                  pathname: "/dashboard/customer/send-email",
                  state: { customer: customer },
                })
              }
            />
          </a>

          <Text>Email</Text>
        </div>
        <div className="icon-actions">
          <a href={`sms:${customer.phoneNumber}`}>
            <Icon component={Chat} onClick={() => console.log("click")} />
          </a>
          <Text>Text</Text>
        </div>
      </div>
      <Tabs defaultActiveKey="1" className="tab-list">
        <TabPane tab="Activity" key="1">
          <div style={{ padding: 20, marginTop: 10, overflowY: "auto", height: "calc(100vh - 15vh)" }}>
            {Array.from(groupActivity || []).map((item) => {
              return (
                <>
                  <p style={{ marginBottom: 10 }}>{moment(item.key).format("MMM YYYY")}</p>

                  {loading
                    ? "Loading ..."
                    : item.data.map((activity) => (
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
                </>
              )
            })}
          </div>
        </TabPane>
        <TabPane tab="Association" key="2">
          <div style={{ overflowY: "auto", height: "calc(100vh - 20%)" }}>
            <div style={{ padding: "3px 20px" }}>
              <Typography>Customers</Typography>
            </div>
            {dataCustomers?.customers[0]?.companies?.length ? (
              <List
                bordered
                size="large"
                dataSource={dataCustomers?.customers[0]?.companies || []}
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
                  pathname: `/dashboard/customer/association/${customerId}`,
                  state: { association: dataCustomers?.customers[0]?.companies },
                })
              }
              className="select-data-email"
              style={{ padding: "16px 24px", justifyContent: "space-between", cursor: "pointer" }}
              aria-hidden
            >
              <Text>Add company</Text>
              <div style={{ border: "none", marginLeft: 24, padding: "0px 8px" }}>
                <Button style={{ border: "none" }} key="list-loadmore-edit" shape="circle" icon={<PlusOutlined />} />
              </div>
            </div>
          </div>
        </TabPane>
        <TabPane tab="About" key="3">
          <div style={{ padding: 20, marginTop: 10 }}>
            <p style={{ marginBottom: 10 }}>About {customer.name}</p>
          </div>
          <BasicList label="Email" value={customer.email} classNameValue="text-style" />
          <BasicList label={customer.phoneNumber} classNameValue="text-style" />
          <SelectList
            label="Contact Owner"
            value={customer.name}
            classNameValue="select-style"
            option={[customer.name]}
          />
          <BasicList label="Last contacted" classNameValue="select-style" />
          <SelectList
            label="Lifecycle stage"
            value={dataCustomers?.customers[0].stage}
            classNameValue="select-style"
            option={[
              "Subscriber",
              "Lead",
              "Marketing qualified lead",
              "Sales qualified lead",
              "Opportunity",
              "Customer",
              "Evangelist",
              "Other",
            ]}
            onClick={handleChangeStage}
          />
          <SelectList
            label="Lead status"
            value={dataCustomers?.customers[0].status}
            classNameValue="select-style"
            option={[
              "New",
              "Open",
              "In progress",
              "Open deal",
              "Unqualified",
              "Attempted to contact",
              "Connected",
              "Bad timing",
            ]}
            onClick={handleChangeStatus}
          />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default DetailCustomer
