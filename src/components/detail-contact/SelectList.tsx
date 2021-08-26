import { CaretDownOutlined } from "@ant-design/icons"
import { Dropdown, Menu } from "antd"
import { MenuInfo } from "rc-menu/lib/interface"
import * as React from "react"

interface IBasicListProps {
  label: string
  value?: string
  classNameValue: string
  option: string[]
  onClick?: (e: MenuInfo) => void
}

const SelectList: React.FC<IBasicListProps> = ({ label, value, classNameValue, option, onClick }: IBasicListProps) => {
  const menu = (
    <Menu>
      {option.map((item) => (
        <Menu.Item onClick={onClick} key={item}>
          {item}
        </Menu.Item>
      ))}
    </Menu>
  )

  return (
    <div className="list-data-contact">
      <p
        style={{
          marginBottom: 5,
          fontFamily: "Poppins",
          fontStyle: "normal",
          fontWeight: "normal",
          fontSize: value ? 12 : 14,
        }}
      >
        {label}
      </p>
      <Dropdown overlay={menu} trigger={["click"]}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
          <p className={classNameValue} style={{ marginBottom: 5 }}>
            {value}
          </p>
          <CaretDownOutlined style={{ color: "#55988d" }} />
        </div>
      </Dropdown>
    </div>
  )
}

export default SelectList
