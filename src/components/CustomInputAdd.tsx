/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusOutlined } from "@ant-design/icons"
import { Button, Select } from "antd"
import * as React from "react"

const { Option } = Select

interface IInputAddProps {
  placeholder: string
  value?: string
  onChange?: (e: string) => void
  option?: any[]
  onAdd: () => void
}

const CInputAdd: React.FC<IInputAddProps> = ({ placeholder, value, onChange, option, onAdd }: IInputAddProps) => {
  return (
    <div className="select-data-email" style={{ padding: "16px 24px" }}>
      <Select
        showSearch
        showArrow={false}
        placeholder={placeholder}
        className="selected-customer"
        value={value}
        bordered={false}
        style={{ width: "100%", border: "none", maxWidth: "100%" }}
        onChange={onChange}
      >
        {option?.map((item) => (
          <Option key={item.id} value={item.id}>
            {item.name}
          </Option>
        ))}
      </Select>
      <div style={{ border: "none", marginLeft: 24, padding: "0px 8px" }}>
        <Button
          disabled={!value}
          onClick={onAdd}
          style={{ border: "none" }}
          key="list-loadmore-edit"
          shape="circle"
          icon={<PlusOutlined />}
        />
      </div>
    </div>
  )
}

export default CInputAdd
