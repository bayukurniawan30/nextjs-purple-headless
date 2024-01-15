import { Box, FormControl, FormHelperText, MenuItem, Select, Typography } from '@mui/material'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import humanizeString from 'humanize-string'
import { FieldProps } from '@/type/field'
import CustomSelect from '../theme-elements/CustomSelect'

const SelectField = ({
  name,
  label,
  control,
  errors,
  helperText,
  required,
  inputProps,
}: FieldProps) => {
  return (
    <Box key={name} mb={2}>
      <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor={name} mb="5px">
        {label}
      </Typography>
      <Controller
        name={name}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <FormControl fullWidth>
            <Select labelId={name} id={name} label={label} input={<CustomSelect />} {...field}>
              {inputProps.fields.map((option: { label: any; value: any }) => {
                return (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                )
              })}
            </Select>
            {helperText && (
              <FormHelperText sx={{ marginLeft: '14px' }}>{helperText}</FormHelperText>
            )}
          </FormControl>
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

export default SelectField
