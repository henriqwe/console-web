import * as plans from 'domains/plans'
import * as common from 'common'
import { CheckCircleIcon } from '@heroicons/react/outline'

export default function Plans() {
  return <Page />
}

function Page() {
  return (
    <plans.Template>
      <div className="flex flex-col w-1/2 h-full gap-4 pt-6 pb-10">
        <p className="text-xl font-bold">Create a project</p>
        <div className="grid h-full grid-cols-2 gap-4">
          <common.Card className="flex flex-col justify-between h-full p-6 bg-white shadow-sm">
            <div>
              <p className="font-bold">Sandbox</p>
              <common.Separator />
              <p className="text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
                perferendis possimus ipsam harum alias quidem recusandae iusto
                quis cupiditate maiores fugiat, optio
              </p>
              <common.Separator />
              <p className="text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
                perferendis possimus ipsam harum alias
              </p>
              <common.Separator />

              <div>
                <p className="font-bold">Features</p>
                <ul>
                  <li className="flex items-center gap-1">
                    <div className="w-5 h-5 text-blue-500">
                      <CheckCircleIcon />
                    </div>
                    abc
                  </li>
                  <li className="flex items-center gap-1">
                    <div className="w-5 h-5 text-blue-500">
                      <CheckCircleIcon />
                    </div>
                    abc
                  </li>
                  <li className="flex items-center gap-1">
                    <div className="w-5 h-5 text-blue-500">
                      <CheckCircleIcon />
                    </div>
                    abc
                  </li>
                </ul>
              </div>
            </div>

            <common.Button className="w-full">
              <p>Choose</p>
            </common.Button>
          </common.Card>
          <common.Card className="flex flex-col justify-between h-full p-6 bg-white shadow-sm">
            <div>
              <p className="font-bold">Dedicated</p>
              <common.Separator />
              <p className="text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
                perferendis possimus ipsam harum alias quidem recusandae iusto
                quis cupiditate maiores fugiat, optio
              </p>
              <common.Separator />
              <p className="text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
                perferendis possimus ipsam harum alias
              </p>
              <common.Separator />

              <div>
                <p className="font-bold">Features</p>
                <div className="grid justify-between w-full grid-cols-2">
                  <ul>
                    <li className="flex items-center gap-1">
                      <div className="w-5 h-5 text-blue-500">
                        <CheckCircleIcon />
                      </div>
                      abc
                    </li>
                    <li className="flex items-center gap-1">
                      <div className="w-5 h-5 text-blue-500">
                        <CheckCircleIcon />
                      </div>
                      abc
                    </li>
                    <li className="flex items-center gap-1">
                      <div className="w-5 h-5 text-blue-500">
                        <CheckCircleIcon />
                      </div>
                      abc
                    </li>
                  </ul>
                  <ul>
                    <li className="flex items-center gap-1">
                      <div className="w-5 h-5 text-blue-500">
                        <CheckCircleIcon />
                      </div>
                      abc
                    </li>
                    <li className="flex items-center gap-1">
                      <div className="w-5 h-5 text-blue-500">
                        <CheckCircleIcon />
                      </div>
                      abc
                    </li>
                    <li className="flex items-center gap-1">
                      <div className="w-5 h-5 text-blue-500">
                        <CheckCircleIcon />
                      </div>
                      abc
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <common.Button className="w-full">
              <p>Choose</p>
            </common.Button>
          </common.Card>
        </div>
      </div>
    </plans.Template>
  )
}
