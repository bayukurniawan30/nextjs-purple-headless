'use client'
import PageHeader, { PageMeta } from '../../../components/shared/PageHeader'
import React, { useEffect, useState } from 'react'
import {
  Box,
  CircularProgress,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import CustomButton from '../../../components/shared/CustomButton'
import PageContainer from '../../../components/container/PageContainer'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import axios from '@/lib/axios'
import { yupResolver } from '@hookform/resolvers/yup'
import DashboardCard from '../../../components/shared/DashboardCard'
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField'
import humanizeString from 'humanize-string'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import CustomSnackbar from '../../../components/forms/theme-elements/CustomSnackbar'
import { useRouter } from 'next/navigation'
import CustomSelect from '../../../components/forms/theme-elements/CustomSelect'
import FieldOptionsMenu from '../../../components/shared/FieldOptionsMenu'
import { TemporaryField, useAddedFields } from '@/hooks/temporaryAddedFields'
import SelectedFieldsList from '../../../components/shared/SelectedFieldsList'
import useSWR from 'swr'
import { FieldSchema, Singleton } from '@/type/api'
import { useFieldsStore } from '@/hooks/availableFields'

interface FormSingletonData {
  name: string
  status: string
  // fields: any
}

const singletonSchema = yup.object().shape({
  name: yup.string().required(),
  status: yup.string().required(),
  // fields: yup.object().json(),
})

const EditSingletonPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const [disable, setDisable] = useState(false)

  const PageMeta: PageMeta = {
    title: 'Edit Singleton',
    description: 'Edit existing singleton',
    breadcrumb: [
      {
        text: 'Content',
      },
      {
        text: 'Singletons',
        href: '/singletons',
      },
      {
        text: 'Edit',
        href: `/singletons/edit/${params.id}`,
      },
    ],
    image: '/images/header/singletons.svg',
  }

  const addedFields = useAddedFields()
  const temporaryAddedFields = useAddedFields().fields
  const availableFields = useFieldsStore.getState().fields

  const { data, error, isLoading } = useSWR<Singleton>(`/singletons/${params.id}`, () =>
    axios
      .get(`/singletons/${params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        return res.data
      })
      .catch((err) => err)
  )

  const handleDeleteField = (uniqueId: string) => {
    addedFields.removeField(uniqueId)
  }

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormSingletonData>({
    resolver: yupResolver(singletonSchema),
    defaultValues: {
      name: data?.name || '',
      status: data?.status || 'draft',
      // fields: JSON.stringify(temporaryAddedFields),
    },
  })

  useEffect(() => {
    addedFields.clearAll()

    setValue('name', data?.name || '')
    setValue('status', data?.status || 'draft')

    setTimeout(() => {
      data?.fields.map((field: FieldSchema) => {
        // find id in availableFields
        const availableField = availableFields.find((f) => f.id === field.id)
        if (availableField) {
          const generateUniqueId = () => {
            return (
              Math.random().toString(36).substring(2, 15) +
              Math.random().toString(36).substring(2, 15)
            )
          }
          const uniqueId = generateUniqueId()

          addedFields.addNewField({
            ...availableField,
            id: field.id,
            uniqueId,
            label: field.label,
            helperText: field.helperText,
            metadata: field.metadata,
          } as TemporaryField)
        }
      })
    }, 500)
  }, [data])

  const onSubmitHandler = async (values: FormSingletonData) => {
    try {
      setDisable(true)

      axios
        .put(
          `/singletons/${params.id}`,
          {
            name: values.name,
            status: values.status,
            fields: JSON.stringify(temporaryAddedFields),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            enqueueSnackbar(`Singleton has been updated successfully`, {
              variant: 'success',
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
            })

            setTimeout(() => {
              addedFields.clearAll()
              router.push('/singletons')
            }, 1000)
          } else {
            setDisable(false)
            enqueueSnackbar(`Failed to update existng singleton. Please try again`, {
              variant: 'error',
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
            })
          }
        })
        .catch((err) => {
          setDisable(false)
          err
        })
    } catch (e) {
      setDisable(false)
      console.log(e)
    }
  }

  const addNewFieldButton = <FieldOptionsMenu page="singleton" />

  const footer = (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingX: 4,
        paddingY: 3,
      }}
    >
      <CustomButton
        variant="contained"
        disableElevation
        disabled={disable}
        type="button"
        onClick={handleSubmit(onSubmitHandler)}
      >
        Save
      </CustomButton>

      <CircularProgress
        color="primary"
        size={24}
        sx={{ marginLeft: 2, display: disable ? 'block' : 'none' }}
      />
    </Box>
  )

  return (
    <PageContainer title={PageMeta.title} description={PageMeta.description}>
      <PageHeader title={PageMeta.title} breadcrumb={PageMeta.breadcrumb} image={PageMeta.image} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <DashboardCard title="Details">
            <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
              <Stack>
                <Box mb={2}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="name"
                    mb="5px"
                  >
                    Name
                  </Typography>

                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        variant="outlined"
                        fullWidth
                        error={errors.name ? true : false}
                        {...field}
                      />
                    )}
                  />
                  {errors.name && (
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      component="label"
                      mb="5px"
                      color={'error'}
                    >
                      {humanizeString(errors.name.message ?? '')}
                    </Typography>
                  )}
                </Box>
                <Box mb={2}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="status"
                    mb="5px"
                  >
                    Status
                  </Typography>
                  <Controller
                    name="status"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <Select
                          labelId="status"
                          id="status"
                          label="Value"
                          input={<CustomSelect />}
                          {...field}
                        >
                          <MenuItem key={'draft'} value={'draft'}>
                            Draft
                          </MenuItem>
                          <MenuItem key={'publish'} value={'publish'}>
                            Publish
                          </MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                  {errors.status && (
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      component="label"
                      mb="5px"
                      color={'error'}
                    >
                      {humanizeString(errors.status.message ?? '')}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Box>
          </DashboardCard>
          <Box height={20} />
          <DashboardCard headtitle="Fields" headerAction={addNewFieldButton} footer={footer}>
            <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
              <SelectedFieldsList
                temporaryAddedFields={temporaryAddedFields}
                onDelete={handleDeleteField}
              />
            </Box>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <DashboardCard title="Setup Dynamic Fields">
            <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
              <Typography variant="subtitle1" component="label" mb="5px">
                Create your own schema by adding fields in the Fields section.
              </Typography>
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>

      <SnackbarProvider
        Components={{
          success: CustomSnackbar,
          error: CustomSnackbar,
        }}
      />
    </PageContainer>
  )
}

export default EditSingletonPage
