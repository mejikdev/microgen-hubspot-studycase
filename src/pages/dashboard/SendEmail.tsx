import "styles/sendEmail.css"

import { Input, message, PageHeader } from "antd"
import CInputEmail from "components/send-email/CInputEmail"
import { useActivityMutation } from "hooks/activity"
import * as React from "react"
import { useHistory, useLocation } from "react-router-dom"

const { TextArea } = Input

interface FormValueSendEmail {
  to?: string
  cc?: string
  from?: string
  subject?: string
  body?: string
}

const SendEmail: React.FC = () => {
  const history = useHistory()
  const { state } = useLocation<{ customer: Customer }>()
  const { sendEmail, createActivity } = useActivityMutation()

  const [loading, setLoading] = React.useState(false)
  const [values, setValues] = React.useState<FormValueSendEmail>({
    to: "",
    cc: "",
    from: "hello@microgen.id",
    subject: "",
    body: "",
  })

  React.useEffect(() => {
    if (state.customer) {
      setValues((prev) => ({ ...prev, to: state.customer.email }))
    }
  }, [state.customer])

  const onChange = (e: React.SyntheticEvent): void => {
    const target = e.target as HTMLInputElement
    setValues({ ...values, [target.name]: target.value })
  }

  const handleSendEmail = async () => {
    setLoading(true)

    if (!values.cc) {
      delete values.cc
    }

    if (!values.to || !values.subject || !values.body || !values.from) {
      setLoading(false)
      message.warning("field must be filled")
    } else {
      delete values.cc

      try {
        await sendEmail({
          variables: {
            input: values,
          },
        }).then(() => {
          createActivity({
            variables: {
              input: {
                title: "Send email",
                desc: values.subject,
                customerId: state.customer.id,
              },
            },
          })
        })

        message.success("Success sent mail")
        history.goBack()
      } catch (e) {
        message.error(e.message)
      }

      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        className="page-header-email"
        title="Tracked Email"
        onBack={() => history.goBack()}
        extra={[
          <div key="save" className="btn-save-modal" onClick={handleSendEmail} aria-hidden="true">
            {loading ? "loading.." : "Send"}
          </div>,
        ]}
      />
      <CInputEmail label="To" value={values?.to} classNameValue="select-style" name="to" onChange={onChange} />
      {/* <CInputEmail label="Cc/Bcc" value={values?.cc} classNameValue="select-style" name="cc" onChange={onChange} /> */}
      <CInputEmail label="From" value={values?.from} classNameValue="select-style" name="from" onChange={onChange} />

      {/* <SelectEmail label="From" value="radiegtya@gmail.com" classNameValue="select-style" /> */}
      <CInputEmail
        label="Subject"
        value={values?.subject}
        classNameValue="select-style"
        name="subject"
        onChange={onChange}
      />

      <TextArea
        rows={4}
        placeholder="Type something brilliant..."
        name="body"
        onChange={onChange}
        // onChange={(e) => setValues({ ...values, body: e.target.value })}
      />
    </div>
  )
}

export default SendEmail
