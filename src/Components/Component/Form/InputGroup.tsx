import { Exec } from '@provenanceio/wallet-utils/lib/proto/cosmos/group/v1/tx_pb'
import { HTMLInputTypeAttribute } from 'react'

interface InputGroupProps {
  className?: string
  label: string
  name: string
  onChange: (value: any) => any
  placeholder?: string
  type?: HTMLInputTypeAttribute | 'select'
  value?: string | Exec
  options?: {
    title: string | number
    value: string | number
    key: string | number
  }[]
}

export const InputGroup = ({
  className = '',
  label,
  name,
  onChange,
  placeholder,
  type = 'text',
  value = '',
  options = [],
}: InputGroupProps) => {
  const getInputType = (type: InputGroupProps['type']) => {
    switch (type) {
      case 'select':
        return (
          <select className="box-border w-full p-2.5 text-sm font-bold" name={name}>
            {options.map((option) => (
              <option value={option.value} key={option.key}>
                {option.title}
              </option>
            ))}
          </select>
        )
      case 'textarea':
        return (
          <textarea
            className="box-border w-full p-2.5 text-sm font-bold"
            name={name}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        )
      case 'checkbox':
        return (
          <input
            className="box-border max-h-[50px] w-full max-w-[50px] self-center p-2.5 text-sm font-bold"
            name={name}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            type={type}
            value={value}
          />
        )
      default:
        return (
          <input
            className="box-border w-full p-2.5 text-sm font-bold"
            name={name}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            type={type}
            value={value}
          />
        )
    }
  }
  return (
    <label
      className={`grid w-full ${
        type === 'checkbox' && 'grid-cols-[1fr_0.25fr] gap-0'
      } gap-2.5 font-bold ${className}`}
    >
      <span className="font-bold">{label}</span>
      {getInputType(type)}
    </label>
  )
}
