import * as common from 'common'
import * as utils from 'utils'
import * as services from 'services'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  useForm,
  FieldValues,
  SubmitHandler,
  Controller
} from 'react-hook-form'
import { ChevronRightIcon } from '@heroicons/react/solid'
import { useUser } from 'contexts/UserContext'
import { useState } from 'react'

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

  const {
    formState: { errors },
    handleSubmit,
    control
  } = useForm({ resolver: yupResolver(addressSchema) })

  const refreshUserData = async () => {
    services.ycodify
      .getUserData({ accessToken: user?.accessToken as string })
      .then((userData) => setUser((prev) => ({ ...prev, userData })))
  }

  async function Submit(formData: formProps) {
    setLoading(true)

    try {
      const res = await services.ycodify.updateAccountAddress({
        username,
        email,
        status,
        addrStreet: formData.addrStreet,
        addrNumber: formData.addrNumber,
        addrCountry: formData.addrCountry,
        addrDistrict: formData.addrDistrict,
        addrCity: formData.addrCity,
        addrZip: formData.addrZip,
        accessToken: user?.accessToken as string
      })

      if (res.status === 200) {
        refreshUserData()
        utils.notification('Address updated successfully!', 'success')
        return
      }
      utils.notification(res.data.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(Submit as SubmitHandler<FieldValues>)}
        className="flex flex-col px-4 gap-y-4"
      >
        <p className="text-xl dark:text-text-primary">Billing address</p>
        <div className="flex flex-col gap-y-4 h-full">
          <div className="flex flex-col col-span-1 xl:grid xl:grid-cols-4 gap-y-4 gap-x-2">
            <Controller
              name="addrStreet"
              control={control}
              defaultValue={addrStreet}
              render={({ field: { onChange } }) => (
                <div className="col-span-1 sm:col-span-3 flex flex-col gap-y-2">
                  <common.Input
                    onChange={onChange}
                    label="Street"
                    placeholder="Street"
                    id="street"
                    name="street"
                    defaultValue={addrStreet}
                    errors={errors.addrStreet}
                  />
                </div>
              )}
            />
            <Controller
              name="addrNumber"
              control={control}
              defaultValue={addrNumber}
              render={({ field: { onChange } }) => (
                <div className="col-span-3 sm:col-span-1 flex flex-col gap-y-2">
                  <common.Input
                    placeholder="Number"
                    label="Number"
                    defaultValue={addrNumber}
                    onChange={onChange}
                    errors={errors.addrNumber}
                  />
                </div>
              )}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-2 gap-y-4">
            <Controller
              name="addrCountry"
              control={control}
              defaultValue={addrCountry}
              render={({ field: { onChange } }) => (
                <div className="w-full flex flex-col gap-y-2">
                  <common.Input
                    placeholder="Country"
                    label="Country"
                    defaultValue={addrCountry}
                    className="col-span-3 sm:col-span-1"
                    onChange={onChange}
                    errors={errors.addrCountry}
                  />
                </div>
              )}
            />
            <Controller
              name="addrDistrict"
              control={control}
              defaultValue={addrDistrict}
              render={({ field: { onChange } }) => (
                <div className="w-full flex flex-col gap-y-2">
                  <common.Input
                    placeholder="State"
                    label="State"
                    defaultValue={addrDistrict}
                    className="col-span-3 sm:col-span-1"
                    onChange={onChange}
                    errors={errors.addrDistrict}
                  />
                </div>
              )}
            />
          </div>

          <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-x-2 justify-evenly gap-y-4">
            <Controller
              name="addrCity"
              control={control}
              defaultValue={addrCity}
              render={({ field: { onChange } }) => (
                <div className="w-full flex flex-col gap-y-2">
                  <common.Input
                    placeholder="City"
                    label="City"
                    defaultValue={addrCity}
                    className="col-span-3 sm:col-span-1"
                    onChange={onChange}
                    errors={errors.addrCity}
                  />
                </div>
              )}
            />
            <Controller
              name="addrZip"
              control={control}
              defaultValue={addrZip}
              render={({ field: { onChange } }) => (
                <div className="w-full flex flex-col gap-y-2">
                  <common.Input
                    placeholder="Zip Code"
                    label="Zip Code"
                    defaultValue={addrZip}
                    className="col-span-3 sm:col-span-1"
                    onChange={onChange}
                    errors={errors.addrZip}
                  />
                </div>
              )}
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

const addressSchema = yup.object().shape({
  addrStreet: yup.string().required('Street is required'),
  addrNumber: yup.string().required('Number is required'),
  addrCountry: yup.string().required('Country is required'),
  addrDistrict: yup.string().required('State is required'),
  addrCity: yup.string().required('City is required'),
  addrZip: yup.string().required('Zip is required')
})
