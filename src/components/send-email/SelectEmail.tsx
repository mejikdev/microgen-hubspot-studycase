import { CaretDownOutlined } from "@ant-design/icons"
import { Dropdown, Menu, Typography } from "antd"
import * as React from "react"

const { Text } = Typography

interface IBasicListProps {
  label: string
  value?: string
  classNameValue: string
}

const SelectEmail: React.FC<IBasicListProps> = ({ label, value, classNameValue }: IBasicListProps) => {
  const menu = (
    <Menu>
      <Menu.Item key="0">1st menu item</Menu.Item>
      <Menu.Item key="1">2nd menu item</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">3rd menu item</Menu.Item>
    </Menu>
  )

  return (
    <div className="select-data-email">
      <Text className="label-field">{label}</Text>
      {value && (
        <Dropdown overlay={menu} trigger={["click"]}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <Text className={classNameValue}>{value}</Text>
            <CaretDownOutlined style={{ color: "#55988d" }} />
          </div>
        </Dropdown>
      )}
    </div>
  )
}

export default SelectEmail
