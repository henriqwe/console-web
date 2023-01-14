import * as common from 'common'
import * as utils from 'utils'
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
import { useSession } from 'next-auth/react'
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
  } = useForm({ resolver: yupResolver(addressSchema) })

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

  function Submit(formData: formProps) {
    setLoading(true)

    console.log('formData', formData)

    utils.api
      .post(
        utils.apiRoutes.updateAccount,
        {
          username,
          email: email,
          status,
          addrStreet: formData.addrStreet,
          addrNumber: formData.addrNumber,
          addrCountry: currentCountry.value,
          addrDistrict: currentDistrict.value,
          addrCity: formData.addrCity,
          addrZip: formData.addrZip
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
                  />
                  {errors.addrStreet && (
                    <p className="text-sm text-red-500">
                      {errors.addrStreet.message}
                    </p>
                  )}
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
                  />
                  {errors.addrNumber && (
                    <p className="text-sm text-red-500">
                      {errors.addrNumber.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-2 gap-y-4">
            <div className="w-full flex flex-col gap-y-2 overflow-visible z-50">
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
              />
              {errors.addrCountry && (
                <p className="text-sm text-red-500">
                  {errors.addrCountry.message}
                </p>
              )}
            </div>
            <div className="w-full flex flex-col gap-y-2 overflow-visible z-50">
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
              />
              {errors.addrDistrict && (
                <p className="text-sm text-red-500">
                  {errors.addrDistrict.message}
                </p>
              )}
            </div>
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
                  />
                  {errors.addrCity && (
                    <p className="text-sm text-red-500">
                      {errors.addrCity.message}
                    </p>
                  )}
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
                  />
                  {errors.addrZip && (
                    <p className="text-sm text-red-500">
                      {errors.addrZip.message}
                    </p>
                  )}
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
  addrCity: yup.string().required('City is required'),
  addrZip: yup.string().required('Zip is required')
})
