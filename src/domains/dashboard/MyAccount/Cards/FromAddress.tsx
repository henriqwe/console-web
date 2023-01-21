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
import * as iso1 from 'iso-3166-1'
import * as iso2 from 'iso-3166-2'

type formProps = {
  addrStreet: string
  addrNumber: string
  addrCountry: {
    name: string
    value: string
  }
  addrDistrict: {
    name: string
    value: string
  }
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

  const defaultCountry = iso1.whereAlpha2(addrCountry) ?? iso1.whereAlpha2('BR')

  const [currentCountry, setCurrentCountry] = useState({
    name: defaultCountry!.country,
    value: defaultCountry!.alpha2
  })

  const defaultDistrict = {
    name:
      iso2.data[currentCountry.value].sub[addrDistrict]?.name ??
      'Rio Grande do Norte',
    code: iso2.data[currentCountry.value].sub[addrDistrict]
      ? addrDistrict
      : 'BR-RN'
  }

  const [currentDistrict, setCurrentDistrict] = useState({
    name: defaultDistrict.name,
    value: defaultDistrict.code
  })

  const {
    formState: { errors },
    handleSubmit,
    control
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        addrStreet: yup.string().required('Street is required'),
        addrNumber: yup.string().required('Number is required'),
        addrCity: yup.string().required('City is required'),
        addrZip: yup.string().required('Zip is required')
      })
    )
  })

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
        addrCountry: currentCountry.value,
        addrDistrict: currentDistrict.value,
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
        <div className="flex flex-col h-full gap-y-4">
          <div className="flex flex-col col-span-1 xl:grid xl:grid-cols-4 gap-y-4 gap-x-2">
            <Controller
              name="addrStreet"
              control={control}
              defaultValue={addrStreet}
              render={({ field: { onChange } }) => (
                <div className="flex flex-col col-span-1 sm:col-span-3 gap-y-2">
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
                <div className="flex flex-col col-span-3 sm:col-span-1 gap-y-2">
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
            <div className="z-50 flex flex-col w-full overflow-visible gap-y-2">
              <label
                htmlFor="addrCountry"
                className="text-sm font-medium text-gray-700 dark:text-text-primary"
              >
                Country
              </label>
              <common.Select
                options={iso1
                  .all()
                  .filter(({ alpha2 }) => alpha2 !== 'CG')
                  .map((country) => ({
                    name: country.country,
                    value: country.alpha2
                  }))}
                value={currentCountry}
                onChange={(e) => {
                  setCurrentCountry(e)

                  const newDistrict = {
                    name: iso2.data[e.value].sub[
                      Object.keys(iso2.data[e.value].sub)[0]
                    ].name,
                    value: Object.keys(iso2.data[e.value].sub)[0]
                  }
                  setCurrentDistrict(newDistrict)
                }}
                errors={errors.addrCountry}
              />
            </div>
            <div className="z-50 flex flex-col w-full overflow-visible gap-y-2">
              <label
                htmlFor="addrDistrict"
                className="text-sm font-medium text-gray-700 dark:text-text-primary"
              >
                District
              </label>
              <common.Select
                options={Object.keys(iso2.data[currentCountry.value].sub).map(
                  (subCode) => ({
                    name: iso2.country(currentCountry.value)?.sub[subCode].name,
                    value: subCode
                  })
                )}
                value={currentDistrict}
                setValue={setCurrentDistrict}
                onChange={(e) => {
                  setCurrentDistrict(e)
                }}
                errors={errors.addrDistrict}
              />
            </div>
          </div>

          <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-x-2 justify-evenly gap-y-4">
            <Controller
              name="addrCity"
              control={control}
              defaultValue={addrCity}
              render={({ field: { onChange } }) => (
                <div className="flex flex-col w-full gap-y-2">
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
                <div className="flex flex-col w-full gap-y-2">
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
        <span className="flex self-end px-3 mt-auto lg:col-start-2">
          <common.Buttons.Ycodify
            icon={
              loading ? (
                <common.Spinner className="w-4 h-4" data-testid="spinner" />
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
