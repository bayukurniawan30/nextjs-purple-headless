import { Box, FormControlLabel, FormGroup, FormHelperText, Switch, Typography } from '@mui/material'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import CustomTextField from '../theme-elements/CustomTextField'
import humanizeString from 'humanize-string'
import { FieldProps } from '@/type/field'

const BooleanField = ({
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
          <>
            <FormGroup>
              <FormControlLabel
                control={<Switch {...field} defaultChecked={false} />}
                label={label}
              />
            </FormGroup>
            {helperText && (
              <FormHelperText sx={{ marginLeft: '14px' }}>{helperText}</FormHelperText>
            )}
          </>
        )}
      />
    </Box>
  )
}

export default BooleanField
