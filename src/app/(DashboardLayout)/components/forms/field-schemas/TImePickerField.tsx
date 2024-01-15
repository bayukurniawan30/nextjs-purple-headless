import { Box, Typography } from '@mui/material'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import CustomTextField from '../theme-elements/CustomTextField'
import humanizeString from 'humanize-string'
import { FieldProps } from '@/type/field'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

const TimePickerField = ({
  name,
  label,
  control,
  errors,
  helperText,
  required,
  inputProps,
}: FieldProps) => {
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
              name={name}
              slotProps={{
                textField: {
                  fullWidth: true,
                  helperText: helperText,
                },
              }}
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
