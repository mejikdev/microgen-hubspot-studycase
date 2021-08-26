import { Input, Typography } from "antd"
import * as React from "react"

const { Text } = Typography
interface IBasicListProps {
  label: string
  value?: string
  classNameValue: string
  name: string
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void
  containerStyle?: React.CSSProperties
  placeholder: string
}

const CustomInputFloating: React.FC<IBasicListProps> = ({
  label,
  value,
  classNameValue,
  name,
  onChange,
  containerStyle,
  placeholder,
}: IBasicListProps) => {
  const [isFocused, setIsFocused] = React.useState(false)
  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  return (
    <div className="select-data-email" style={{ ...containerStyle }}>
      {isFocused ? <Text className="label-field">{label}</Text> : value && <Text className="label-field">{label}</Text>}

      <Input
        allowClear
        className="input-email"
        type="text"
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  )
}

export default CustomInputFloating
