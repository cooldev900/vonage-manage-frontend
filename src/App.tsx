import { ReactElement, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

interface FormType {
  firstName: string
  lastName?: string
  company?: string
  title?: string
  email?: string
  street: string
  city?: string
  state?: string
  zipcode?: string
  country?: string
  phoneNumber: string
  messageTemplate: string
}

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
  messageTemplate: Yup.string().required('Message template is required')
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
    formState: { errors, isDirty },
    reset: resetForm,
    trigger
  } = useForm<FormType>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  })

  const onSubmit: SubmitHandler<FormType> = (data) => {
    console.log(data)
  }

  return (
    <div className="p-20 md:w-full">
      <div className="flex flex-col gap-10 whitespace-nowrap">
        <div className="bg-white">
          <p className="pb-3 text-3xl text-center mb-10">
            Vonage Message Management
          </p>
          <form
            className="flex flex-wrap md:px-16 sm:px-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="md:w-1/2 sm:w-full md:pr-8 sm:pr-4">
              <div className="md:m-8 sm:m-4">
                <label className="mb-5 w-64 flex flex-col items-center px-4 py-6 bg-white text-gray-300 rounded-lg shadow-lg tracking-wide uppercase border border-gray-300 hover:border-transparent cursor-pointer hover:bg-blue-500 hover:text-white">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                  </svg>
                  <span className="mt-2 text-base leading-normal">
                    Select a file
                  </span>
                  <input type="file" className="hidden" />
                </label>

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
                <button className="block w-full bg-blue-500 text-white font-bold py-4 rounded-lg mb-5">
                  Submit
                </button>
              </div>
            </div>

            <div className="md:w-1/2 sm:w-full  md:pl-8 sm:pl-4">
              <div className="md:m-8 sm:m-4">
                <p className="pb-3 text-2xl  md:px-5 sm:px-3">
                  Columns for Contacts
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
                      placeholder="Put in your fullname."
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
                      placeholder="Put in your fullname."
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
                      placeholder="Put in your fullname."
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
                      placeholder="Put in your fullname."
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
                      placeholder="Put in your fullname."
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
                      placeholder="Put in your fullname."
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
                      placeholder="Put in your fullname."
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
                      placeholder="Put in your fullname."
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
                      placeholder="Put in your fullname."
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
                      placeholder="Put in your fullname."
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
                      placeholder="Put in your fullname."
                      className="border border-gray-300 shadow p-3 w-3/5 rounded"
                    />
                  </div>
                  {/* <p className="text-sm text-red-400 mt-2">
                  Column name for Country is required
                </p> */}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
