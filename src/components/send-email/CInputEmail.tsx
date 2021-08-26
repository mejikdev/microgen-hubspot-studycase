import { Input, Typography } from "antd"
import * as React from "react"

const { Text } = Typography
interface IBasicListProps {
  label: string
  value?: string
  classNameValue: string
  name: string
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void
}

const CInputEmail: React.FC<IBasicListProps> = ({ label, value, classNameValue, name, onChange }: IBasicListProps) => {
  return (
    <div className="select-data-email">
      <Text className="label-field">{label}</Text>
      <Input allowClear className="input-email" type="text" name={name} onChange={onChange} value={value} />
    </div>
  )
}

export default CInputEmail
