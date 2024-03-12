import { Box, FormControlLabel, FormGroup, FormHelperText, Switch, Typography } from '@mui/material'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import humanizeString from 'humanize-string'
import { FieldProps } from '@/type/field'
import ReactCodeMirror from '@uiw/react-codemirror'
import { useCallback, useState } from 'react'

const CodeEditorField = ({
  name,
  label,
  control,
  errors,
  helperText,
  required,
  inputProps,
  onChange,
}: FieldProps) => {
  const [value, setValue] = useState("console.log('hello world!');")
  const onChangeValue = useCallback((val: string, viewUpdate: unknown) => {
    onChange?.(name, val)
    setValue(val)
  }, [])

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
            <ReactCodeMirror value={value} height="200px" onChange={onChangeValue} />
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

export default CodeEditorField
