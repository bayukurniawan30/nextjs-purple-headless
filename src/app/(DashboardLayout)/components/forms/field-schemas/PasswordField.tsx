import {
  Box,
  FormHelperText,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Tooltip,
  Typography,
} from '@mui/material'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import CustomTextField from '../theme-elements/CustomTextField'
import humanizeString from 'humanize-string'
import { FieldProps } from '@/type/field'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useState } from 'react'

const PasswordField = ({
  name,
  label,
  control,
  errors,
  helperText,
  required,
  inputProps,
}: FieldProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

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
            <OutlinedInput
              id={'field' + name}
              type={showPassword ? 'text' : 'password'}
              fullWidth
              endAdornment={
                <InputAdornment position="end">
                  <Tooltip title={'Show/Hide ' + label}>
                    <IconButton
                      aria-label={'Show/Hide ' + label}
                      edge="end"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              }
            />
            {helperText && (
              <FormHelperText sx={{ marginLeft: '14px' }}>{helperText}</FormHelperText>
            )}
          </>
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

export default PasswordField
