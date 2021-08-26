import { CloseCircleOutlined, SearchOutlined } from "@ant-design/icons"
import { Checkbox, Col, Input, Layout, PageHeader, Row } from "antd"
import { CheckboxValueType } from "antd/lib/checkbox/Group"
import { useCompanyQuery } from "hooks/company"
import { useCustomerMutation } from "hooks/customer"
import * as React from "react"
import { useHistory, useLocation, useParams } from "react-router-dom"

const { Content } = Layout

interface CustomerProps {
  user?: User
}

const defaultUser = {
  id: "",
  email: "Anonymouse@gmail.com",
  firstName: "anonymouse",
}

const AddAssociationCustomer = ({ user = defaultUser }: CustomerProps): JSX.Element => {
  const [selected, setSelected] = React.useState<CheckboxValueType[]>()
  const [searchText, setSearchText] = React.useState<string>("")
  const [listCompany, setListCompany] = React.useState<Company[]>()
  const [loading, setLoading] = React.useState<boolean>(false)

  const { customerId } = useParams<{ customerId: string }>()
  const history = useHistory()
  const { state } = useLocation<{ association: Customer[] }>()

  const { association } = state

  const { updateCustomer } = useCustomerMutation()

  const { data: companies } = useCompanyQuery({
    variables: {
      sort: "name_ASC",
      filter: {
        createdById: user.id,
      },
    },
  })

  React.useEffect(() => {
    if (association.length) {
      setSelected([...association.map((item) => item.id)])
    }
  }, [association])

  React.useEffect(() => {
    if (companies?.companies.length) {
      const newList = searchCompanyData(searchText, companies.companies)
      setListCompany(newList)
    }
  }, [companies, searchText])

  const searchCompanyData = (name: string, data: Company[]) => {
    if (name) {
      return data.filter((item: { name: string }) => {
        return item.name.toLowerCase().includes(name.toLowerCase())
      })
    }

    return data
  }

  const handleAddAssociation = async () => {
    setLoading(true)
    await updateCustomer({
      variables: {
        id: customerId,
        input: {
          companiesIds: selected,
        },
      },
    })
      .then((response) => {
        history.goBack()
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)

        console.log(err)
      })
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  const onChange = (checkedValues: CheckboxValueType[]) => {
    setSelected(checkedValues)
  }

  return (
    <Layout className="layout-contact">
      <PageHeader
        title="Add Contact"
        onBack={() => history.goBack()}
        extra={[
          <div key="save" className="btn-save-modal" aria-hidden="true" onClick={() => handleAddAssociation()}>
            {loading ? "Loading" : "Save"}
          </div>,
        ]}
        style={{ background: "#fff", width: "100%" }}
      />
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

      <Content className="container-content-dashboard">
        <div style={{ overflow: "auto", height: "100%", width: "100%" }}>
          <Checkbox.Group value={selected} defaultValue={selected} style={{ width: "100%" }} onChange={onChange}>
            {Array.from(listCompany || []).map((item) => {
              return (
                <Row
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: 53,
                    borderBottom: "1px solid lightgray",
                    background: "#fff",
                    width: "100%",
                    padding: "7px 22px",
                  }}
                >
                  <Col span={24}>
                    <Checkbox value={item.id}>{item.name}</Checkbox>
                  </Col>
                </Row>
              )
            })}
          </Checkbox.Group>
        </div>
      </Content>
    </Layout>
  )
}

export default AddAssociationCustomer
