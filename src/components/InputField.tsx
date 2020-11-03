import React, { InputHTMLAttributes } from 'react'
import { useField } from 'formik'
import { addClasses } from '../utils/form'


type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string,
}

export const InputField = (props: InputProps) => {
  const [field, {error, touched}] = useField(props)
  const className: string = (props.className || '') + ' ' + addClasses(error, touched)

  return(
    <>
      <input {...field} {...props} className={className} />
      {error && <div className="invalid-feedback">{error}</div>}
    </>
  )
}
