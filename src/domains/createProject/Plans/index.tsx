import * as common from 'common'
import * as createProject from 'domains/createProject'
import { CheckCircleIcon } from '@heroicons/react/outline'
import { routes } from 'domains/routes'
import { useRouter } from 'next/router'

export function Plans() {
  const { setSelectedPlan, setCurrentPage } = createProject.useCreateProject()
  const router = useRouter()

  return (
    <section className="flex flex-col w-1/2 h-full gap-4 pt-6 pb-10">
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold">Create a project</p>
        <common.Button
          type="button"
          onClick={() => {
            router.push(routes.dashboard)
          }}
          color="red-outline"
        >
          <p>Cancel</p>
        </common.Button>
      </div>
      <div className="grid h-full grid-cols-2 gap-4">
        <common.Card className="flex flex-col justify-between h-full p-6 bg-white shadow-sm">
          <div>
            <p className="font-bold">Sandbox</p>
            <div className="my-2">
              <common.Separator />
            </div>
            <p className="text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
              perferendis possimus ipsam harum alias quidem recusandae iusto
              quis cupiditate maiores fugiat, optio
            </p>
            <div className="my-2">
              <common.Separator />
            </div>
            <p className="text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
              perferendis possimus ipsam harum alias
            </p>
            <div className="my-2">
              <common.Separator />
            </div>

            <div>
              <p className="font-bold">Features</p>
              <ul>
                {[1, 2, 3].map((item) => (
                  <li className="flex items-center gap-1" key={item}>
                    <div className="w-5 h-5 text-blue-500">
                      <CheckCircleIcon />
                    </div>
                    abc
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <common.Button
            className="w-full"
            type="button"
            onClick={() => {
              setSelectedPlan('Sandbox')
              setCurrentPage('FORM')
            }}
          >
            <p>Choose</p>
          </common.Button>
        </common.Card>
        <common.Card className="flex flex-col justify-between h-full p-6 bg-white shadow-sm">
          <div>
            <p className="font-bold">Dedicated</p>
            <div className="my-2">
              <common.Separator />
            </div>
            <p className="text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
              perferendis possimus ipsam harum alias quidem recusandae iusto
              quis cupiditate maiores fugiat, optio
            </p>
            <div className="my-2">
              <common.Separator />
            </div>
            <p className="text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
              perferendis possimus ipsam harum alias
            </p>
            <div className="my-2">
              <common.Separator />
            </div>

            <div>
              <p className="font-bold">Features</p>
              <div className="grid justify-between w-full grid-cols-2">
                <ul>
                  {[1, 2, 3].map((item) => (
                    <li className="flex items-center gap-1" key={item}>
                      <div className="w-5 h-5 text-blue-500">
                        <CheckCircleIcon />
                      </div>
                      abc
                    </li>
                  ))}
                </ul>
                <ul>
                  {[1, 2, 3].map((item) => (
                    <li className="flex items-center gap-1" key={item}>
                      <div className="w-5 h-5 text-blue-500">
                        <CheckCircleIcon />
                      </div>
                      abc
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <common.Button
            className="w-full"
            type="button"
            disabled
            onClick={() => {
              setSelectedPlan('Dedicated')
              setCurrentPage('FORM')
            }}
          >
            <p>Choose</p>
          </common.Button>
        </common.Card>
      </div>
    </section>
  )
}
