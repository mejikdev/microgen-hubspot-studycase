//TODO: find solution for any type or component with generic
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Button, List } from "antd"
import * as React from "react"

interface ListProps {
  title: string
  list: any[]
  onDelete: (item: any) => void
  onEdit: (item: any) => void
  renderItem: (item: any) => string | React.ReactNode
  onClickItem: (item: any) => void
}

const ListComponet: React.FC<ListProps> = ({ title, list, onDelete, onEdit, renderItem, onClickItem }: ListProps) => {
  return (
    <>
      <List
        key={title}
        size="large"
        header={<div>{title}</div>}
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            onClick={() => onClickItem(item)}
            actions={[
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(item)
                }}
                key="list-loadmore-edit"
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
              />,
              <Button
                type="primary"
                shape="circle"
                key="list-loadmore-more"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(item)
                }}
                danger
                icon={<DeleteOutlined />}
              />,
            ]}
          >
            {renderItem(item)}
          </List.Item>
        )}
      />
    </>
  )
}

export default ListComponet
