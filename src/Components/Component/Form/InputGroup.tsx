import { HTMLInputTypeAttribute } from 'react'

interface InputGroupProps {
  className?: string
  label: string
  name: string
  onChange: (value: any) => any
  placeholder?: string
  type?: HTMLInputTypeAttribute
  value: string
}

export const InputGroup = ({
  className = '',
  label,
  name,
  onChange,
  placeholder,
  type = 'text',
  value,
}: InputGroupProps) => (
  <label className={`grid w-full gap-2.5 font-bold ${className}`}>
    <span className="font-bold">{label}</span>
    <input
      className="box-border w-full p-2.5 text-sm font-bold"
      name={name}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      value={value}
    />
  </label>
)
