'use client'
import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer'
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard'
import axios from '@/lib/axios'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import CustomSnackbar from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomSnackbar'
import PageHeader, { PageMeta } from '@/app/(DashboardLayout)/components/shared/PageHeader'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField'
import humanizeString from 'humanize-string'
import CustomButton from '@/app/(DashboardLayout)/components/shared/CustomButton'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'
import { User } from '@/type/api'

interface FormData {
  firstName: string
  lastName: string
  email: string
  // password: string;
}

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  // password: yup.string().min(6).required(),
})

const EditUserPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const [disable, setDisable] = useState(false)

  const PageMeta: PageMeta = {
    title: 'Edit User',
    description: 'Edit existing user',
    breadcrumb: [
      {
        text: 'Settings',
      },
      {
        text: 'Users',
        href: '/settings/users',
      },
      {
        text: 'Edit',
        href: `/settings/users/edit/${params.id}`,
      },
    ],
    image: '/images/header/users.svg',
  }

  const { data, error, isLoading } = useSWR<User>(`/users/${params.id}`, () =>
    axios
      .get(`/users/${params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        return res.data
      })
      .catch((err) => err)
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: data?.profile.firstName || '',
      lastName: data?.profile.lastName || '',
      email: data?.email || '',
      // password: "",
    },
  })

  useEffect(() => {
    setValue('firstName', data?.profile.firstName || '')
    setValue('lastName', data?.profile.lastName || '')
    setValue('email', data?.email || '')
  }, [data])

  const onSubmitHandler = async (values: FormData) => {
    try {
      setDisable(true)

      axios
        .put(
          `/users/${params.id}`,
          {
            email: values.email,
            // password: values.password,
            firstName: values.firstName,
            lastName: values.lastName,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            enqueueSnackbar(`User data has been updated successfully`, {
              variant: 'success',
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
            })

            setTimeout(() => {
              router.push('/settings/users')
            }, 1000)
          } else {
            setDisable(false)
            enqueueSnackbar(`Failed to edit existng user. Please try again`, {
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

  if (error) return <div>failed to load</div>

  return (
    <PageContainer title={PageMeta.title} description={PageMeta.description}>
      <PageHeader title={PageMeta.title} breadcrumb={PageMeta.breadcrumb} image={PageMeta.image} />
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <DashboardCard footer={footer}>
          <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
            <Stack>
              <Box mb={2}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  component="label"
                  htmlFor="firstName"
                  mb="5px"
                >
                  First Name
                </Typography>

                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      variant="outlined"
                      fullWidth
                      error={errors.firstName ? true : false}
                      {...field}
                    />
                  )}
                />
                {errors.firstName && (
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    mb="5px"
                    color={'error'}
                  >
                    {humanizeString(errors.firstName.message ?? '')}
                  </Typography>
                )}
              </Box>
              <Box mb={2}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  component="label"
                  htmlFor="lastName"
                  mb="5px"
                >
                  Last Name
                </Typography>

                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      variant="outlined"
                      fullWidth
                      error={errors.lastName ? true : false}
                      {...field}
                    />
                  )}
                />
                {errors.lastName && (
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    mb="5px"
                    color={'error'}
                  >
                    {humanizeString(errors.lastName.message ?? '')}
                  </Typography>
                )}
              </Box>
              <Box mb={2}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  component="label"
                  htmlFor="email"
                  mb="5px"
                >
                  Email
                </Typography>

                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      type="email"
                      variant="outlined"
                      fullWidth
                      error={errors.email ? true : false}
                      {...field}
                    />
                  )}
                />
                {errors.email && (
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    mb="5px"
                    color={'error'}
                  >
                    {humanizeString(errors.email.message ?? '')}
                  </Typography>
                )}
              </Box>
              {/* <Box mb={2}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  component="label"
                  htmlFor="password"
                  mb="5px"
                >
                  Password
                </Typography>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      type="password"
                      variant="outlined"
                      fullWidth
                      error={errors.password ? true : false}
                      {...field}
                    />
                  )}
                />
                {errors.password && (
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    mb="5px"
                    color={"error"}
                  >
                    {humanizeString(errors.password.message ?? "")}
                  </Typography>
                )}
              </Box> */}
            </Stack>
          </Box>
        </DashboardCard>
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

export default EditUserPage
