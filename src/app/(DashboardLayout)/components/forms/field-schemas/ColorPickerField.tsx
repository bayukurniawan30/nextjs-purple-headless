import { Box, IconButton, InputAdornment, OutlinedInput, Tooltip, Typography } from '@mui/material'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import CustomTextField from '../theme-elements/CustomTextField'
import humanizeString from 'humanize-string'
import { FieldProps } from '@/type/field'
import { useState } from 'react'
import { Color, ColorResult, RGBColor, SketchPicker } from 'react-color'
import CustomButton from '../../shared/CustomButton'
import { ColorLens } from '@mui/icons-material'

const ColorPickerField = ({
  name,
  label,
  control,
  errors,
  helperText,
  required,
  inputProps,
}: FieldProps) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false)
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

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
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
            <OutlinedInput
              id={'field-' + name}
              type={'text'}
              fullWidth
              {...field}
              value={colorPicker.colorHex}
              endAdornment={
                <InputAdornment position="end">
                  <Tooltip title={'Show/Hide color picker'}>
                    <IconButton
                      aria-label={'Show/Hide color picker'}
                      edge="end"
                      onClick={() => {
                        setDisplayColorPicker(!displayColorPicker)
                        setColorPicker({
                          ...colorPicker,
                          displayColorPicker: !colorPicker.displayColorPicker,
                        })
                      }}
                      onMouseDown={handleMouseDown}
                    >
                      <ColorLens />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              }
            />
            {displayColorPicker && (
              <div
                style={{
                  position: 'absolute',
                  zIndex: 2,
                }}
              >
                <SketchPicker color={colorPicker.color} onChange={handleChange} />
              </div>
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

export default ColorPickerField
