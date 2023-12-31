import { ChangeEvent, ReactElement, useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { FormType } from './types'
import axios from 'axios'

const allowedExtensions = ['csv']

// Define validation schema using Yup
const validationSchema: Yup.ObjectSchema<FormType> = Yup.object({
  firstName: Yup.string().required('Column name for First Name is required'),
  lastName: Yup.string().optional(),
  company: Yup.string().optional(),
  title: Yup.string().optional(),
  email: Yup.string().optional(),
  street: Yup.string().required('Street is required'),
  city: Yup.string().optional(),
  state: Yup.string().optional(),
  zipcode: Yup.string().optional(),
  country: Yup.string().optional(),
  phoneNumber: Yup.string().required('Phone number is required'),
  messageTemplate: Yup.string().required('Message template is required'),
  beginRow: Yup.string().test(
    'is-greater-or-equal-one',
    'Begin Row must be number and greater or equal to 2',
    function (value) {
      if (!value) return true
      try {
        let beginValue = parseInt(value)
        return beginValue > 1
      } catch (e) {
        return false
      }
    }
  ),
  endRow: Yup.string().test(
    'is-greater-or-equal',
    'End row must be  be number and equal to or greater than start row or 2',
    function (value) {
      if (!value) return true
      let { beginRow } = this.parent
      if (!beginRow) return true
      try {
        return parseInt(value) > 2 && parseInt(value) >= parseInt(beginRow)
      } catch (e) {
        return false
      }
    }
  )
})

const initialValues = {
  firstName: '',
  lastName: '',
  company: '',
  title: '',
  email: '',
  street: '',
  city: '',
  state: '',
  zipcode: '',
  country: '',
  phoneNumber: '',
  messageTemplate: ''
}

function App(): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm
  } = useForm<FormType>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  })

  const [fileError, setFileError] = useState<string>('')
  const [csvFile, setCsvFile] = useState<File>()
  const [fileName, setFileName] = useState<string>('')

  const ref = useRef<boolean>(false)

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const fileExtension = file?.type.split('/')[1]
      if (!allowedExtensions.includes(fileExtension)) {
        setFileError('Please input a csv file')
        return
      }
      setFileName(file.name)
      setCsvFile(file)
    }
  }

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    if (ref.current) return
    if (!csvFile) {
      setFileError('Please select a csv file.')
      return
    }

    const formdata = new FormData()
    formdata.append('csvfile', csvFile)
    Object.keys(data).map((key) => {
      if (key === 'beginRow') {
        formdata.append('beginRow', data['beginRow'] ? data['beginRow'] : '-1')
        return
      }
      if (key === 'endRow') {
        formdata.append('endRow', data['endRow'] ? data['endRow'] : '-1')
        return
      }
      //@ts-ignore
      formdata.append(key, data[key] ? data[key] : '-')
    })
    ref.current = true
    try {
      const { data: resultData } = await axios.post(
        'http://localhost:8000/send_sms',
        formdata,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer your-token'
          }
        }
      )
      console.log({ resultData })
      if (resultData?.result === 'success') {
        // resetForm(initialValues)
        alert(resultData?.message)
      } else
        alert(
          `Some error is happened in server. Please retry. ${resultData?.message}`
        )
    } catch (e) {
      console.log(e)
    }
    ref.current = false
  }

  return (
    <div className="md:p-20 md:pt-10 p-0 md:w-full">
      <div className="flex flex-col gap-10 whitespace-nowrap">
        <div className="bg-white">
          <p className="p-1 text-2xl md:text-3xl text-center md:my-10 sm:my-5">
            Vonage Message Management
          </p>
          <form
            className="flex flex-wrap lg:px-16 md:px-8 px-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="md:w-1/2 w-full lg:pr-8 md:pr-4 pr-1">
              <div className="m-2 md:m-8 sm:m-4">
                <div className="mb-5">
                  <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-gray-300 rounded-lg shadow-lg tracking-wide uppercase border border-gray-300 hover:border-transparent cursor-pointer hover:bg-blue-500 hover:text-white">
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                    </svg>
                    <span className="mt-2 text-base leading-normal">
                      {fileName ? fileName : 'Select a file'}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".csv"
                      onChange={handleFileInputChange}
                    />
                  </label>
                  {fileError && (
                    <p className="text-sm text-red-400 mt-2">{fileError}</p>
                  )}
                </div>

                <div className="w-full mb-5">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Your Message Template
                  </label>
                  <textarea
                    rows={10}
                    {...register('messageTemplate')}
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  ></textarea>
                  {!!errors?.messageTemplate?.message && (
                    <p className="text-sm text-red-400 mt-2">
                      {errors.messageTemplate.message}
                    </p>
                  )}
                </div>

                <div className="mb-5 sm:w-full md:px-5 sm:px-3">
                  <div className="flex items-center justify-between gap-[15px]">
                    <label
                      htmlFor="firstName"
                      className="block mb-2 font-bold text-gray-600"
                    >
                      Beginning Row
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="Put in your beginning row index."
                      className="border border-gray-300 shadow p-3 w-3/5 rounded mb-"
                      {...register('beginRow')}
                    />
                  </div>

                  {!!errors?.beginRow?.message && (
                    <p className="text-sm text-red-400 mt-2">
                      {errors.beginRow.message}
                    </p>
                  )}
                </div>

                <div className="mb-5 sm:w-full md:px-5 sm:px-3">
                  <div className="flex items-center justify-between gap-[15px]">
                    <label
                      htmlFor="firstName"
                      className="block mb-2 font-bold text-gray-600"
                    >
                      Ending Row
                    </label>
                    <input
                      id="firstName"
                      type="textd"
                      placeholder="Put in your ending row index."
                      className="border border-gray-300 shadow p-3 w-3/5 rounded mb-"
                      {...register('endRow')}
                    />
                  </div>

                  {!!errors?.endRow?.message && (
                    <p className="text-sm text-red-400 mt-2">
                      {errors.endRow.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={ref.current}
                  className="hidden md:block w-full bg-blue-500 text-white font-bold py-4 rounded-lg mb-5"
                >
                  Submit
                </button>
              </div>
            </div>

            <div className="md:w-1/2 w-full  lg:pl-8 md:pl-4 pl-1">
              <div className="m-2 md:m-8 sm:m-4">
                <p className="pb-3 text-2xl md:text-3xl md:px-5 sm:px-3">
                  Column Names for Contact Data
                </p>

                <div className="mb-5 sm:w-full md:px-5 sm:px-3">
                  <div className="flex items-center justify-between gap-[15px]">
                    <label
                      htmlFor="firstName"
                      className="block mb-2 font-bold text-gray-600"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="Put in column name of First Name."
                      className="border border-gray-300 shadow p-3 w-3/5 rounded mb-"
                      {...register('firstName')}
                    />
                  </div>

                  {!!errors?.firstName?.message && (
                    <p className="text-sm text-red-400 mt-2">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="mb-5 sm:w-full md:px-5 sm:px-3">
                  <div className="flex items-center justify-between gap-[15px]">
                    <label
                      htmlFor="lastName"
                      className="block mb-2 font-bold text-gray-600"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      {...register('lastName')}
                      placeholder="Put in column name of Last Name."
                      className="border border-gray-300 shadow p-3 w-3/5 rounded"
                    />
                  </div>
                  {/* <p className="text-sm text-red-400 mt-2">
                  Column name for First Name is required
                </p> */}
                </div>

                <div className="mb-5 sm:w-full md:px-5 sm:px-3">
                  <div className="flex items-center justify-between gap-[15px]">
                    <label
                      htmlFor="phoneNumber"
                      className="block mb-2 font-bold text-gray-600"
                    >
                      Phone number
                    </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      {...register('phoneNumber')}
                      placeholder="Put in column name of Phone Number."
                      className="border border-gray-300 shadow p-3 w-3/5 rounded"
                    />
                  </div>
                  {errors.phoneNumber?.message && (
                    <p className="text-sm text-red-400 mt-2">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div className="mb-5 sm:w-full md:px-5 sm:px-3">
                  <div className="flex items-center justify-between gap-[15px]">
                    <label
                      htmlFor="company"
                      className="block mb-2 font-bold text-gray-600"
                    >
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      {...register('company')}
                      placeholder="Put in column name of Company."
                      className="border border-gray-300 shadow p-3 w-3/5 rounded"
                    />
                  </div>
                  {/* <p className="text-sm text-red-400 mt-2">
                  Column name for Company is required
                </p> */}
                </div>

                <div className="mb-5 sm:w-full md:px-5 sm:px-3">
                  <div className="flex items-center justify-between gap-[15px]">
                    <label
                      htmlFor="title"
                      className="block mb-2 font-bold text-gray-600"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      {...register('title')}
                      placeholder="Put in column name of Title."
                      className="border border-gray-300 shadow p-3 w-3/5 rounded"
                    />
                  </div>
                  {/* <p className="text-sm text-red-400 mt-2">
                  Column name for TITLE is required
                </p> */}
                </div>

                <div className="mb-5 sm:w-full md:px-5 sm:px-3">
                  <div className="flex items-center justify-between gap-[15px]">
                    <label
                      htmlFor="email"
                      className="block mb-2 font-bold text-gray-600"
                    >
                      Email
                    </label>
                    <input
                      type="text"
                      id="email"
                      {...register('email')}
                      placeholder="Put in column name of Email."
                      className="border border-gray-300 shadow p-3 w-3/5 rounded"
                    />
                  </div>
                  {/* <p className="text-sm text-red-400 mt-2">
                  Column name for email is required
                </p> */}
                </div>

                <div className="mb-5 sm:w-full md:px-5 sm:px-3">
                  <div className="flex items-center justify-between gap-[15px]">
                    <label
                      htmlFor="street"
                      className="block mb-2 font-bold text-gray-600"
                    >
                      Street
                    </label>
                    <input
                      type="text"
                      id="street"
                      {...register('street')}
                      placeholder="Put in column name of Street."
                      className="border border-gray-300 shadow p-3 w-3/5 rounded"
                    />
                  </div>
                  {errors?.street?.message && (
                    <p className="text-sm text-red-400 mt-2">
                      {errors.street.message}
                    </p>
                  )}
                </div>

                <div className="mb-5 sm:w-full md:px-5 sm:px-3">
                  <div className="flex items-center justify-between gap-[15px]">
                    <label
                      htmlFor="city"
                      className="block mb-2 font-bold text-gray-600"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      {...register('city')}
                      placeholder="Put in column name of City."
                      className="border border-gray-300 shadow p-3 w-3/5 rounded"
                    />
                  </div>
                  {/* <p className="text-sm text-red-400 mt-2">
                  Column name for city is required
                </p> */}
                </div>

                <div className="mb-5 sm:w-full md:px-5 sm:px-3">
                  <div className="flex items-center justify-between gap-[15px]">
                    <label
                      htmlFor="state"
                      className="block mb-2 font-bold text-gray-600"
                    >
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      {...register('state')}
                      placeholder="Put in column name of State."
                      className="border border-gray-300 shadow p-3 w-3/5 rounded"
                    />
                  </div>
                  {/* <p className="text-sm text-red-400 mt-2">
                  Column name for state is required
                </p> */}
                </div>

                <div className="mb-5 sm:w-full md:px-5 sm:px-3">
                  <div className="flex items-center justify-between gap-[15px]">
                    <label
                      htmlFor="zipcode"
                      className="block mb-2 font-bold text-gray-600"
                    >
                      Zipcode
                    </label>
                    <input
                      type="text"
                      id="zipcode"
                      {...register('zipcode')}
                      placeholder="Put in column name of Zip code."
                      className="border border-gray-300 shadow p-3 w-3/5 rounded"
                    />
                  </div>
                  {/* <p className="text-sm text-red-400 mt-2">
                  Column name for Zipcode is required
                </p> */}
                </div>

                <div className="mb-5 sm:w-full md:px-5 sm:px-3">
                  <div className="flex items-center justify-between gap-[15px]">
                    <label
                      htmlFor="country"
                      className="block mb-2 font-bold text-gray-600"
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      {...register('country')}
                      placeholder="Put in column name of Country."
                      className="border border-gray-300 shadow p-3 w-3/5 rounded"
                    />
                  </div>
                  {/* <p className="text-sm text-red-400 mt-2">
                  Column name for Country is required
                </p> */}
                </div>
              </div>
              <div className="px-3">
                <button
                  type="submit"
                  disabled={ref.current}
                  className="block md:hidden w-full bg-blue-500 text-white font-bold py-4 rounded-lg mb-5"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
