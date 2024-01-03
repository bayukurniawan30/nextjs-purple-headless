'use client'
import PageHeader, { PageMeta } from '../../components/shared/PageHeader'
import React, { useState } from 'react'
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
import CustomButton from '../../components/shared/CustomButton'
import PageContainer from '../../components/container/PageContainer'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import axios from '@/lib/axios'
import { yupResolver } from '@hookform/resolvers/yup'
import DashboardCard from '../../components/shared/DashboardCard'
import CustomTextField from '../../components/forms/theme-elements/CustomTextField'
import humanizeString from 'humanize-string'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import CustomSnackbar from '../../components/forms/theme-elements/CustomSnackbar'
import { useRouter } from 'next/navigation'
import CustomSelect from '../../components/forms/theme-elements/CustomSelect'
import FieldOptionsMenu from '../../components/shared/FieldOptionsMenu'
import { useAddedFields } from '@/hooks/temporaryAddedFields'
import SelectedFieldsList from '../../components/shared/SelectedFieldsList'

const PageMeta: PageMeta = {
  title: 'Create Singleton',
  description: 'Create new singleton',
  breadcrumb: [
    {
      text: 'Singletons',
    },
    {
      text: 'Singletons',
      href: '/settings/users',
    },
    {
      text: 'Create',
      href: '/singletons/create',
    },
  ],
  image: '/images/header/singletons.svg',
}

interface FormData {
  name: string
  status: string
  // fields: any
}

const schema = yup.object().shape({
  name: yup.string().required(),
  status: yup.string().required(),
  // fields: yup.object().json(),
})

const CreateSingletonPage = () => {
  const router = useRouter()
  const [disable, setDisable] = useState(false)

  const addedFields = useAddedFields()
  const temporaryAddedFields = useAddedFields().fields

  const handleDeleteField = (uniqueId: string) => {
    addedFields.removeField(uniqueId)
    console.log(`Deleting field with uniqueId: ${uniqueId}`)
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      status: 'draft',
      // fields: JSON.stringify(temporaryAddedFields),
    },
  })

  const onSubmitHandler = async (values: FormData) => {
    try {
      setDisable(true)

      axios
        .post(
          `/singletons`,
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
          if (res.status === 201) {
            enqueueSnackbar(`New singleton has been created successfully`, {
              variant: 'success',
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
            })

            setTimeout(() => {
              router.push('/singletons')
            }, 1000)
          } else {
            enqueueSnackbar(`Failed to create new singleton. Please try again`, {
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
      <CustomButton variant="contained" disableElevation disabled={disable} type="submit">
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
      <form onSubmit={handleSubmit(onSubmitHandler)}>
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
            <DashboardCard title="Something">
              <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}></Box>
            </DashboardCard>
          </Grid>
        </Grid>
      </form>

      <SnackbarProvider
        Components={{
          success: CustomSnackbar,
          error: CustomSnackbar,
        }}
      />
    </PageContainer>
  )
}

export default CreateSingletonPage
