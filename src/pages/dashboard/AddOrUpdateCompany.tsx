import { Form, message } from "antd"
import { PageHeader } from "antd"
import CustomInputFloating from "components/CustomInputFloating"
import { useCompanyMutation } from "hooks/company"
import * as React from "react"
import { useHistory, useLocation } from "react-router-dom"

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

interface IStateValue {
  name: string
  phoneNumber: string
}

const AddOrUpdateCompany: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [values, setValues] = React.useState<IStateValue>({
    name: "",
    phoneNumber: "",
  })

  const history = useHistory()
  const location = useLocation<{ mode: string; data: Company | undefined }>()

  const [form] = Form.useForm()

  React.useEffect(() => {
    if (location.state && location.state.mode === "update" && location.state.data) {
      const { name, phoneNumber } = location.state.data
      setValues({
        name: name,
        phoneNumber: phoneNumber || "",
      })
    }
  }, [location.state])

  const { createCompany, updateCompany } = useCompanyMutation()

  const onFinish = async (values: Partial<Company>) => {
    if (loading) {
      return
    }

    setLoading(true)

    const { name, phoneNumber } = values

    if (!name || !phoneNumber) {
      message.error("All fields must be filled")
      setLoading(false)
      return
    }

    const isValidPhoneNumberRegex = /\+?([ -]?\d+)+|\(\d+\)([ -]\d+)/

    if (!isValidPhoneNumberRegex.test(phoneNumber)) {
      message.error("Invalid Phone number")
      setLoading(false)
      return
    }

    try {
      if (location.state.mode === "create") {
        await createCompany({
          variables: {
            input: {
              name,
              phoneNumber,
            },
          },
        })
      }

      if (location.state.mode === "update") {
        await updateCompany({
          variables: {
            id: location.state.data?.id,
            input: {
              name,
              phoneNumber,
            },
          },
        })
      }
    } catch (e) {
      alert(e.message)
    }

    setLoading(false)
    form.resetFields()
    history.goBack()
  }

  let initialValues = {
    name: "",
  }

  if (location.state && location.state.mode === "update" && location.state.data) {
    const { name } = location.state.data
    initialValues = {
      name,
    }
  }

  const onChange = (e: React.SyntheticEvent): void => {
    const target = e.target as HTMLInputElement
    setValues({ ...values, [target.name]: target.value })
  }

  return (
    <>
      <PageHeader
        title=""
        onBack={() => history.goBack()}
        extra={[
          <div
            key="save"
            className={loading ? "btn-save-modal-disabled" : "btn-save-modal"}
            aria-hidden="true"
            onClick={() => !loading && onFinish(values)}
          >
            {loading ? "Loading .." : "Save"}
          </div>,
        ]}
      />

      <Form
        {...formItemLayout}
        form={form}
        name="createOrUpdateCompany"
        onFinish={() => onFinish(values)}
        initialValues={initialValues}
        scrollToFirstError
      >
        <CustomInputFloating
          label="Company Name"
          classNameValue="select-style"
          name="name"
          placeholder="Company Name"
          value={values.name}
          onChange={onChange}
          containerStyle={{ flexDirection: "column", alignItems: "start", justifyContent: "center" }}
        />
        <CustomInputFloating
          label="Phone"
          classNameValue="select-style"
          name="phoneNumber"
          value={values?.phoneNumber}
          placeholder="Phone"
          onChange={onChange}
          containerStyle={{ flexDirection: "column", alignItems: "start", justifyContent: "center" }}
        />
      </Form>
    </>
  )
}

export default AddOrUpdateCompany
