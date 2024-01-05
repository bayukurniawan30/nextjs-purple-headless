import { TemporaryField, useAddedFields } from '@/hooks/temporaryAddedFields'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import CustomTextField from '../forms/theme-elements/CustomTextField'
import humanizeString from 'humanize-string'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import CustomButton from './CustomButton'
import { enqueueSnackbar } from 'notistack'

interface FormData {
  label: string
  helperText: string
  metadata: string
}

const schema = yup.object().shape({
  label: yup.string().required(),
  helperText: yup.string().default(''),
  metadata: yup.string().required(),
})

interface Props {
  open: boolean
  onClose: () => void
  onSaveHandler: (submitted: boolean) => void
  field: TemporaryField | null
  disable: boolean
}

const UpdateFieldDialog = ({ open, onClose, onSaveHandler, field, disable }: Props) => {
  const [disableSave, setDisableSave] = useState(false)
  const addedFields = useAddedFields()

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      label: field?.label ?? '',
      helperText: field?.helperText ?? '',
      metadata: field ? JSON.stringify(field.metadata, null, 2) : '',
    },
  })

  useEffect(() => {
    setValue('label', field?.label ?? '')
    setValue('helperText', field?.helperText ?? '')
    setValue('metadata', field ? JSON.stringify(field.metadata, null, 2) : '')
  }, [field])

  const onSubmitFieldHandler = (values: FormData) => {
    setDisableSave(true)

    const data = { ...field, ...values } as TemporaryField
    data.metadata = JSON.parse(values.metadata)

    setTimeout(() => {
      setDisableSave(false)
      addedFields.updateField(data)

      enqueueSnackbar(`Field details has been updated successfully`, {
        variant: 'success',
        anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
      })

      onSaveHandler(true)
    }, 500)
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{field?.name} Field Details</DialogTitle>
      <form onSubmit={handleSubmit(onSubmitFieldHandler)}>
        <DialogContent dividers sx={{ width: { xs: '280px', sm: '500px' } }}>
          <Stack>
            <Box mb={2}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                component="label"
                htmlFor="label"
                mb="5px"
              >
                Label
              </Typography>

              <Controller
                name="label"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    variant="outlined"
                    fullWidth
                    error={errors.label ? true : false}
                    {...field}
                  />
                )}
              />
              {errors.label && (
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  component="label"
                  mb="5px"
                  color={'error'}
                >
                  {humanizeString(errors.label.message ?? '')}
                </Typography>
              )}
            </Box>
            <Box mb={2}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                component="label"
                htmlFor="helperText"
                mb="5px"
              >
                Helper Text
              </Typography>

              <Controller
                name="helperText"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    variant="outlined"
                    fullWidth
                    error={errors.helperText ? true : false}
                    {...field}
                  />
                )}
              />
              {errors.helperText && (
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  component="label"
                  mb="5px"
                  color={'error'}
                >
                  {humanizeString(errors.helperText.message ?? '')}
                </Typography>
              )}
            </Box>
            <Box mb={2}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                component="label"
                htmlFor="metadata"
                mb="5px"
              >
                Metadata
              </Typography>

              <Controller
                name="metadata"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    multiline
                    rows={6}
                    variant="outlined"
                    fullWidth
                    error={errors.metadata ? true : false}
                    {...field}
                  />
                )}
              />
              {errors.metadata && (
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  component="label"
                  mb="5px"
                  color={'error'}
                >
                  {humanizeString(errors.metadata.message ?? '')}
                </Typography>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            padding: 3,
          }}
        >
          <Button onClick={onClose}>Cancel</Button>
          <CustomButton variant="contained" disableElevation disabled={disableSave} type="submit">
            Save
          </CustomButton>
          <CircularProgress
            color="error"
            size={24}
            sx={{ marginLeft: 2, display: disableSave ? 'block' : 'none' }}
          />
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default UpdateFieldDialog
