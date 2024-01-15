import { Control, FieldErrors } from 'react-hook-form'

export interface FieldProps {
  name: string
  label: string
  control: Control<
    {
      [x: string]: string | number | undefined
      [x: number]: string | number | undefined
    },
    any
  >
  errors: FieldErrors<{
    [x: string]: string | number | undefined
    [x: number]: string | number | undefined
  }>

  helperText?: string
  required?: boolean
  inputProps?: any
  onChange?: (key: string, value: any) => void
}
