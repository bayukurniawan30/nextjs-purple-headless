import { Box, Typography } from '@mui/material'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import humanizeString from 'humanize-string'
import { FieldProps } from '@/type/field'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { useState } from 'react'

const TimePickerField = ({
  name,
  label,
  control,
  errors,
  helperText,
  required,
  inputProps,
  onChange,
}: FieldProps) => {
  const [value, setValue] = useState<string>()

  return (
    <Box mb={2}>
      <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor={name} mb="5px">
        {label}
      </Typography>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <TimePicker
              format={inputProps?.format}
              slotProps={{
                textField: {
                  fullWidth: true,
                  helperText: helperText,
                },
              }}
              {...field}
              onChange={(value: any) => {
                onChange?.(name, value)
                setValue(value)
              }}
              value={value}
            />
          </LocalizationProvider>
        )}
      />
      {errors[name] && (
        <Typography variant="subtitle1" fontWeight={600} component="label" mb="5px" color={'error'}>
          {humanizeString(errors[name]?.message ?? '')}
        </Typography>
      )}
    </Box>
  )
}

export default TimePickerField
