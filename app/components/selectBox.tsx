import * as React from 'react'
import { capitalize } from '../utils/capitalize'
import { FaChevronDown } from 'react-icons/fa'
import { Select } from 'flowbite-react'

interface props {
  options: {
    name: string
    value: any
  }[]
  className?: string
  containerClassName?: string
  id?: string
  name?: string
  label?: string
  value?: any
  onChange?: (...args: any) => any
  required?: boolean
}

export function SelectBox({
  options = [],
  onChange = () => {},
  className = '',
  containerClassName = '',
  name,
  id,
  value,
  label,
  required,
}: props) {
  console.log({ value })
  return (
    <div className="w-full">
      <label htmlFor={id} className="font-semibold text-gray-700">
        {label}
      </label>
      <div className={`flex  items-center ${containerClassName} my-2`}>
        <select
          className={`${className} text-md block w-full rounded-lg  border border-gray-600 bg-gray-700 p-2.5  text-gray-200 placeholder-gray-400 focus:border-blue-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-blue-500`}
          id={id}
          name={name}
          required={required}
          onChange={onChange}
          value={value || ''}
        >
          {options.map((option) => (
            <option
              key={option.name}
              value={option.value}
              className="text-lg font-bold"
            >
              {capitalize(option.name)}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
