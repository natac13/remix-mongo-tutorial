import React from 'react'

interface FormFieldProps {
  label: string
  name: string
  type?: string
  value: any
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  defaultValue?: any
}

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  defaultValue,
}: FormFieldProps) {
  const [errorText, setErrorText] = React.useState<string | undefined>(error)

  React.useEffect(() => {
    setErrorText(error)
  }, [error])

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="font-semibold text-gray-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={(e) => {
          onChange(e)
          setErrorText(undefined)
        }}
        className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-500"
        defaultValue={defaultValue}
      />
      <p className="text-red-500">{errorText ? errorText : ''}</p>
    </div>
  )
}
