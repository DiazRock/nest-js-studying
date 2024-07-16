import { Input } from './Input'
import { FormProvider, useForm } from 'react-hook-form'
import { useState } from 'react'
import { GrMail } from 'react-icons/gr'
import { BsFillCheckSquareFill } from 'react-icons/bs'

export const Form = ({
    submitCallBack,
    listOfInputs,
    successText
}) => {
    const methods = useForm()
    const [success, setSuccess] = useState(false)
  
    const onSubmit = methods.handleSubmit((e, data) => submitCallBack(data) && setSuccess(true))
    console.log("The elements ", listOfInputs)
    return (
      <FormProvider {...methods}>
        <form
          onSubmit={e => e.preventDefault()}
          noValidate
          autoComplete="off"
          className="container"
        >
          <div className="grid gap-5 md:grid-cols-2">
            { listOfInputs.map(element => <Input {...element} /> ) }
          </div>
          <div className="mt-5">
            {success && (
              <p className="font-semibold text-green-500 mb-5 flex items-center gap-1">
                <BsFillCheckSquareFill /> { successText }
              </p>
            )}
            <button
              onClick={onSubmit}
              className="p-5 rounded-md bg-blue-600 font-semibold text-white flex items-center gap-1 hover:bg-blue-800"
            >
              <GrMail />
              Submit
            </button>
          </div>
        </form>
      </FormProvider>
    )
  }