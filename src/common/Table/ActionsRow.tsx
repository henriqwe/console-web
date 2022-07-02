import * as common from 'common'
import router from 'next/router'
import { useState } from 'react'

type ActionsRowProps = {
  actions: AcoesProps[]
}

type AcoesProps = {
  title: string
  url?: string

  handler?: any
  icon: JSX.Element
}

export function ActionsRow({ actions }: ActionsRowProps) {
  const [disabled, setDisabled] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<AcoesProps | null>(null)
  return (
    <td className="relative py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
      <p className="flex items-center gap-2">
        {actions.map((item) => (
          <span
            key={`actions-row-${item.title}`}
            className="w-5 h-5 max-w-[1.25rem] max-h-[1.25rem] flex cursor-pointer"
            onClick={() => {
              if (item.url) {
                router.push(item.url)
                return
              }
              if (item.title === 'Delete') {
                setOpenModal(true)
                setSelectedItem(item)
                return
              }
              item.handler()
            }}
            data-testid="button"
          >
            {item.icon}
          </span>
        ))}
      </p>
      <common.Modal
        setOpen={setOpenModal}
        title="Are you sure you wanto to delete this item?"
        open={openModal}
        buttonTitle={selectedItem?.title as string}
        description="This action can't be undone!!!"
        handleSubmit={() => {
          setDisabled(true)
          selectedItem?.handler().then(() => {
            setDisabled(false)
          })
        }}
        disabled={disabled}
      />
    </td>
  )
}
