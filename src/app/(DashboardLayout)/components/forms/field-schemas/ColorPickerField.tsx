import { Box, Typography } from '@mui/material'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import CustomTextField from '../theme-elements/CustomTextField'
import humanizeString from 'humanize-string'
import { FieldProps } from '@/type/field'
import { useState } from 'react'
import { Color, ColorResult, RGBColor, SketchPicker } from 'react-color'

const ColorPickerField = ({
  name,
  label,
  control,
  errors,
  helperText,
  required,
  inputProps,
}: FieldProps) => {
  const [colorPicker, setColorPicker] = useState({
    displayColorPicker: false,
    color: {
      r: 255,
      g: 255,
      b: 255,
      a: 1,
    } as RGBColor,
    colorHex: '#ffffff',
  })

  const handleChange = (color: ColorResult) => {
    setColorPicker({
      ...colorPicker,
      color: color.rgb,
      colorHex: color.hex,
    })
  }

  return (
    <Box key={name} mb={2}>
      <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor={name} mb="5px">
        {label}
      </Typography>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <CustomTextField
              variant="outlined"
              fullWidth
              helperText={helperText}
              inputProps={inputProps}
              error={errors[name] ? true : false}
              onClick={() =>
                setColorPicker({
                  ...colorPicker,
                  displayColorPicker: !colorPicker.displayColorPicker,
                })
              }
              {...field}
            />
            <SketchPicker color={colorPicker.color} onChange={handleChange} />
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

export default ColorPickerField
