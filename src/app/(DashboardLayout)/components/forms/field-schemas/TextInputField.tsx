import { Box, Typography } from '@mui/material'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import CustomTextField from '../theme-elements/CustomTextField'
import humanizeString from 'humanize-string'
import { FieldProps } from '@/type/field'

const TextInputField = ({
  name,
  label,
  control,
  errors,
  helperText,
  required,
  inputProps,
  typeUrl = false,
}: FieldProps) => {
  return (
    <Box key={name} mb={2}>
      <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor={name} mb="5px">
        {label}
      </Typography>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <CustomTextField
            variant="outlined"
            fullWidth
            helperText={helperText}
            inputProps={inputProps}
            error={errors[name] ? true : false}
            type={typeUrl ? 'url' : 'text'}
            {...field}
          />
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

export default TextInputField
