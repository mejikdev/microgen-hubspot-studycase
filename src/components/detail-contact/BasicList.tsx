import * as React from "react"

interface IBasicListProps {
  label: string
  value?: string
  classNameValue: string
}

const BasicList: React.FC<IBasicListProps> = ({ label, value, classNameValue }: IBasicListProps) => {
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
      {value && (
        <p className={classNameValue} style={{ marginBottom: 5 }}>
          {value}
        </p>
      )}
    </div>
  )
}

export default BasicList
