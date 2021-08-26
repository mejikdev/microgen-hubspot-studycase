import "styles/customer.css"

import Icon from "@ant-design/icons"
import { CloseCircleOutlined, ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons"
import { Input, Layout, Modal, Select, Tabs } from "antd"
import { AddCompany, AddContact } from "assets/icons"
import List from "components/List"
import { useCompanyMutation, useCompanyQuery } from "hooks/company"
import { useCustomerMutation, useCustomerQuery } from "hooks/customer"
import * as React from "react"
import { useHistory, useParams } from "react-router-dom"

const { Content } = Layout
const { TabPane } = Tabs
const { Option } = Select
const { confirm } = Modal

interface IGroupedData<T> {
  key: string
  data: T
}
interface BaseData {
  name: string
}

interface CustomerProps {
  user?: User
}

const defaultUser = {
  id: "",
  email: "Anonymouse@gmail.com",
  firstName: "anonymouse",
}

const Customer = ({ user = defaultUser }: CustomerProps): JSX.Element => {
  const history = useHistory()
  const { currentTab } = useParams<{ currentTab: string }>()

  const {
    data: dataCustomers,
    loading: loadingCustomers,
    refetch: refetchDataQustomers,
  } = useCustomerQuery({
    variables: {
      sort: "name_ASC",
      filter: {
        createdById: user?.id,
      },
    },
  })
  const { deleteCustomer } = useCustomerMutation()

  const {
    data: companies,
    loading: loadingCompanies,
    refetch: refetchDataCompanies,
  } = useCompanyQuery({
    variables: {
      sort: "name_ASC",
      filter: {
        createdById: user.id,
      },
    },
  })
  const { deleteCompany } = useCompanyMutation()

  const [groupedCustomer, setGroupedCustomer] = React.useState<IGroupedData<Customer[]>[]>([])
  const [groupedCompanies, setGroupedCompanies] = React.useState<IGroupedData<Company[]>[]>([])
  const [activeTab, setActiveTab] = React.useState<number>(currentTab === "companies" ? 2 : 1)
  const [searchText, setSearchText] = React.useState<string>("")

  function groupDataByFirstCharName<Type extends BaseData>(data: Type[]) {
    return data.reduce<{ [key: string]: Type[] }>((groups, item) => {
      const letter = item.name.charAt(0)

      groups[letter] = groups[letter] || []
      groups[letter].push(item)

      return groups
    }, {})
  }

  React.useEffect(() => {
    if (dataCustomers?.customers.length) {
      const groupedCustomer = groupDataByFirstCharName<Customer>(dataCustomers.customers)
      if (groupedCustomer) {
        const newData = Object.keys(groupedCustomer).map((key) => ({ key, data: groupedCustomer[key] }))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newGroupedCustomer = searchGroupedData(searchText, newData) as any
        setGroupedCustomer(newGroupedCustomer)
      }
      return
    }

    setGroupedCustomer([])
  }, [dataCustomers?.customers, searchText])

  React.useEffect(() => {
    if (companies?.companies.length) {
      const groupedCompanies = groupDataByFirstCharName<Company>(companies.companies)
      if (groupedCompanies) {
        const newData = Object.keys(groupedCompanies).map((key) => ({ key, data: groupedCompanies[key] }))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newGroupedCompanies = searchGroupedData(searchText, newData) as any
        setGroupedCompanies(newGroupedCompanies)
      }
      return
    }

    setGroupedCompanies([])
  }, [companies?.companies, searchText])

  React.useEffect(() => {
    if (history.action === "POP") {
      if (currentTab === "companies") {
        refetchDataCompanies()
      } else {
        refetchDataQustomers()
      }
    }
  }, [dataCustomers, companies, history.action, refetchDataQustomers, refetchDataCompanies, currentTab])

  React.useEffect(() => {
    if (currentTab === "companies") {
      setActiveTab(2)
    } else {
      setActiveTab(1)
    }
  }, [currentTab])

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value)
  }

  function searchGroupedData(name: string, groupedData: Array<IGroupedData<Customer[]> | IGroupedData<Company[]>>) {
    if (name) {
      let groups = groupedData.filter((group) => group.key.includes(name[0]))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      groups = groups.map((group: any) => {
        group.data = group.data.filter((data: Customer | Company) => data.name.includes(name))
        return group
      })

      return groups
    }

    return groupedData
  }

  function changeTabs(key: string) {
    if (parseInt(key) === 1) {
      history.replace("/dashboard/contacts")
    } else {
      history.replace("/dashboard/companies")
    }
  }

  const handleChangeSortCustomer = (value: string) => {
    refetchDataQustomers({
      sort: value + "_ASC",
      filter: {
        createdById: user.id,
      },
    })
  }

  const handleChangeSortCompany = (value: string) => {
    refetchDataCompanies({
      sort: value + "_ASC",
      filter: {
        createdById: user.id,
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
          refetchDataQustomers()
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
          refetchDataCompanies()
        })
      },
    })
  }

  return (
    <Layout className="layout-contact">
      <Input
        bordered={false}
        value={searchText}
        onChange={handleSearch}
        className="input-search"
        placeholder="Search Name..."
        style={{ padding: "0px 20px" }}
        suffix={
          searchText ? (
            <CloseCircleOutlined className="reset-search" onClick={() => setSearchText("")}>
              reset
            </CloseCircleOutlined>
          ) : (
            <SearchOutlined className="trigger-search" onClick={() => setSearchText("")}>
              search
            </SearchOutlined>
          )
        }
      />
      <div className="btn-add">
        {activeTab === 1 ? (
          <Icon
            component={AddContact}
            onClick={() =>
              history.push({
                pathname: "/dashboard/add-customer",
                state: {
                  mode: "create",
                },
              })
            }
          />
        ) : (
          <Icon
            component={AddCompany}
            onClick={() =>
              history.push({
                pathname: "/dashboard/add-company",
                state: {
                  mode: "create",
                },
              })
            }
          />
        )}
      </div>
      <Content className="container-content-dashboard">
        <Tabs activeKey={String(activeTab)} onChange={changeTabs} className="tab-list">
          <TabPane tab="Contacts" key="1">
            <div className="wrapper-select">
              <Select defaultValue="allContact" className="input-select">
                <Option value="allContact">All contacts {dataCustomers?.customers.length || 0}</Option>
              </Select>
              <Select defaultValue="name" className="input-select" onChange={handleChangeSortCustomer}>
                <Option value="name">Name</Option>
                <Option value="createdAt">Created at</Option>
                {/* <Option value="Yiminghe">yiminghe</Option> */}
              </Select>
            </div>
            <div style={{ overflow: "auto", height: "calc(100vh - 18%)" }}>
              {loadingCustomers ? (
                <span>Loading ...</span>
              ) : (
                Array.from(groupedCustomer || []).map((item) => {
                  return (
                    <List
                      key={item.key}
                      title={item.key}
                      list={item.data}
                      renderItem={(item) => item.name}
                      onDelete={(item) => handleDeleteCustomer(item.id)}
                      onEdit={(item) =>
                        history.push({
                          pathname: "/dashboard/update-customer",
                          state: { mode: "update", data: item },
                        })
                      }
                      onClickItem={(item) => {
                        history.push({
                          pathname: "/dashboard/customer/" + item.id,
                          state: { customer: item },
                        })
                      }}
                    />
                  )
                })
              )}
            </div>
          </TabPane>
          <TabPane tab="Company" key="2">
            <div className="wrapper-select">
              <Select defaultValue="allCompany" className="input-select">
                <Option value="allCompany">All company {companies?.companies.length || 0}</Option>
              </Select>
              <Select defaultValue="name" className="input-select" onChange={handleChangeSortCompany}>
                <Option value="name">Name</Option>
                <Option value="createdAt">Created at</Option>
                {/* <Option value="Yiminghe">yiminghe</Option> */}
              </Select>
            </div>
            <div style={{ overflow: "auto", height: "calc(100vh - 18%)" }}>
              {loadingCompanies ? (
                <span>Loading...</span>
              ) : (
                Array.from(groupedCompanies || []).map((item) => {
                  return (
                    <List
                      key={item.key}
                      title={item.key}
                      list={item.data}
                      renderItem={(item) => item.name}
                      onDelete={(item) => handleDeleteCompany(item.id)}
                      onEdit={(item) =>
                        history.push({
                          pathname: "/dashboard/update-company",
                          state: { mode: "update", data: item },
                        })
                      }
                      onClickItem={(item) => {
                        history.push({
                          pathname: "/dashboard/company/" + item.id,
                          state: { company: item },
                        })
                      }}
                    />
                  )
                })
              )}
            </div>
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  )
}

export default Customer
