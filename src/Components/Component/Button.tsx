interface ButtonProps {
  variant?: 'cancel'
  children?: any
  className?: string
  onClick?: () => any
  type?: 'button' | 'submit' | 'reset'
}

const classes = {
  cancel: `bg-gray-400 text-gray-800`,
}

export const Button = ({ className, variant, ...props }: ButtonProps) => (
  <button
    className={`cursor-pointer rounded border-none bg-primary-300 py-2.5 px-5 text-sm font-bold text-gray-100
                disabled:mt-2.5 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-800
                ${variant ? classes[variant] : ''}
                ${className}
            `}
    {...props}
  />
)
