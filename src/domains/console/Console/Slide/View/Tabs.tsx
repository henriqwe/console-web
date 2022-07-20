import { Tab } from '@headlessui/react'

type TabsProps = {
  categories: any
}
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function Tabs({ categories }: TabsProps) {
  return (
    <div className="w-full px-2">
      <Tab.Group>
        <Tab.List className="flex space-x-2 bg-white rounded-md">
          {Object.keys(categories).map((categoria) => (
            <Tab
              key={categoria}
              className={({ selected }) =>
                classNames(
                  'group inline-flex items-center py-2 px-1 border-b-2 font-medium text-xs cursor-pointer justify-center flex-1 gap-2 ',
                  selected
                    ? 'focus:ring-indigo-500 focus:border-indigo-500 border-indigo-500 text-indigo-600'
                    : ' text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )
              }
            >
              {categories[categoria]?.icon}
              {categoria}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {Object.values(categories).map((secao, idx) => (
            <Tab.Panel key={idx}>{secao.content}</Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
