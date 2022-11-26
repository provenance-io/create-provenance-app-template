import { FormEvent } from 'react'

interface FormProps {
  className?: string
  children?: any
  onSubmit?: (e: FormEvent<HTMLFormElement>) => any
}

export const Form = ({ className = '', ...props }: FormProps) => (
  <form {...props} className={`grid w-full gap-5 ${className}`} />
)
