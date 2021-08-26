import { ArrowLeftOutlined } from "@ant-design/icons"
import { Form, Input, message, Modal } from "antd"
import * as React from "react"

interface ModalProps {
  setOpenModalFormCS: (arg0: boolean) => void
  setDataCustomer: (dataCustomer: DataCustomer) => void
  handleUpdateCustomer: (arg0: ValueFormCustomer) => void
  handleCreateCustomer: (arg0: ValueFormCustomer) => void
  openModalFormCS: boolean
  dataCustomer: DataCustomer
}

interface DataCustomer {
  id: string
  name: string
  phoneNumber: string
  email: string
  type?: string
}

const ModalCustomer: React.FC<ModalProps> = ({
  setOpenModalFormCS,
  openModalFormCS,
  setDataCustomer,
  dataCustomer,
  handleUpdateCustomer,
  handleCreateCustomer,
}: ModalProps) => {
  const [form] = Form.useForm()

  const onFinish = (values: ValueFormCustomer) => {
    delete values.prefix

    const onFill = !values.name || !values.email || !values.phoneNumber
    if (onFill) {
      message.error("All fields must be filled")
    } else {
      if (dataCustomer.type === "create") {
        handleCreateCustomer(values)
      } else {
        handleUpdateCustomer(values)
      }
      form.resetFields()
      setDataCustomer({ name: "", email: "", phoneNumber: "", type: "", id: "" })
      setOpenModalFormCS(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setDataCustomer({ name: "", email: "", phoneNumber: "", type: "", id: "" })
    setOpenModalFormCS(false)
  }

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

  const TitleModal = (
    <div>
      <ArrowLeftOutlined onClick={handleCancel} />
    </div>
  )

  return (
    <>
      <Modal
        title={TitleModal}
        visible={openModalFormCS}
        onOk={form.submit}
        // onCancel={handleCancel}
        closeIcon={
          <div className="btn-save-modal" aria-hidden="true" onClick={() => onFinish(form.getFieldsValue())}>
            Save
          </div>
        }
        footer={null}
      >
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={{
            name: dataCustomer.name || "",
            email: dataCustomer.email || "",
            phoneNumber: dataCustomer.phoneNumber || "",
            prefix: "62",
          }}
          scrollToFirstError
        >
          <Form.Item
            name="name"
            label="Name"
            tooltip="What do you want others to call you?"
            rules={[{ required: true, message: "Please input your name!", whitespace: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ required: true, message: "Please input your phone number!" }]}
          >
            <Input
              addonBefore={
                <Form.Item name="prefix" noStyle>
                  +62
                </Form.Item>
              }
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ModalCustomer
