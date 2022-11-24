import * as common from 'common'
import * as utils from 'utils'
import { ChevronRightIcon } from '@heroicons/react/solid'
import { useUser } from 'contexts/UserContext'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

type formProps = {
  addrStreet: string
  addrNumber: string
  addrCountry: string
  addrDistrict: string
  addrCity: string
  addrZip: string
}
export function FromAddress() {
  const { user, setUser } = useUser()
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()

  const {
    username,
    email,
    addrStreet,
    addrNumber,
    addrCountry,
    addrDistrict,
    addrCity,
    addrZip,
    status
  } = user?.userData || {}
  const [form, setForm] = useState<formProps>({
    addrStreet,
    addrNumber,
    addrCountry,
    addrDistrict,
    addrCity,
    addrZip
  })
  async function getUserData() {
    const { data } = await utils.api.get(utils.apiRoutes.userData, {
      headers: {
        Authorization: session?.accessToken as string
      }
    })
    return data
  }
  const refreshUserData = async () => {
    getUserData().then((userData) => setUser((prev) => ({ ...prev, userData })))
  }
  function handleUpdateAddress(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    utils.api
      .post(
        utils.apiRoutes.updateAccount,
        {
          username,
          email: email,
          status,
          addrStreet: form.addrStreet,
          addrNumber: form.addrNumber,
          addrCountry: form.addrCountry,
          addrDistrict: form.addrDistrict,
          addrCity: form.addrCity,
          addrZip: form.addrZip
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: session?.accessToken as string
          }
        }
      )
      .then((res) => {
        if (res.status === 200) {
          refreshUserData()

          utils.notification('Address updated successfully!', 'success')
        } else utils.notification(res.data.message, 'error')
      })
      .then(() => setLoading(false))
  }
  return (
    <div>
      <form
        onSubmit={(e) => handleUpdateAddress(e)}
        className="flex flex-col px-4 gap-y-4"
      >
        <p className="text-xl dark:text-text-primary">Billing address</p>
        <div className="flex flex-col gap-y-4 h-full">
          <div className="flex flex-col col-span-1 xl:grid xl:grid-cols-4 gap-y-4 gap-x-2">
            <common.Input
              placeholder="Street"
              label="Street"
              className="col-span-1 sm:col-span-3"
              onChange={(e) =>
                setForm({
                  ...form,
                  addrStreet: e.target.value
                })
              }
              value={form.addrStreet}
            />
            <common.Input
              placeholder="Number"
              label="Number"
              className="col-span-3 sm:col-span-1"
              onChange={(e) =>
                setForm({
                  ...form,
                  addrNumber: e.target.value
                })
              }
              value={form.addrNumber}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-2 gap-y-4">
            <common.Input
              placeholder="Country"
              label="Country"
              onChange={(e) =>
                setForm({
                  ...form,
                  addrCountry: e.target.value
                })
              }
              maxLength={2}
              value={form.addrCountry}
            />
            <common.Input
              placeholder="State"
              label="State"
              onChange={(e) =>
                setForm({
                  ...form,
                  addrDistrict: e.target.value
                })
              }
              maxLength={2}
              value={form.addrDistrict}
            />
          </div>

          <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-x-2 justify-evenly gap-y-4">
            <common.Input
              placeholder="City"
              label="City"
              onChange={(e) =>
                setForm({
                  ...form,
                  addrCity: e.target.value
                })
              }
              value={form.addrCity}
            />
            <common.Input
              placeholder="Zip code"
              label="Zip code"
              onChange={(e) =>
                setForm({
                  ...form,
                  addrZip: e.target.value
                })
              }
              value={form.addrZip}
            />
          </div>
        </div>
        <span className="flex self-end mt-auto px-3 lg:col-start-2">
          <common.Buttons.Ycodify
            icon={
              loading ? (
                <common.Spinner className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )
            }
            className="w-max"
            type="submit"
          >
            Update Address
          </common.Buttons.Ycodify>
        </span>
      </form>
    </div>
  )
}
