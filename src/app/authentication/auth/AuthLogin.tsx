import React, { useState } from 'react'
import { Box, Typography, Stack } from '@mui/material'
import Link from 'next/link'

import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField'
import CustomButton from '@/app/(DashboardLayout)/components/shared/CustomButton'
import { Controller, useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/auth'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import humanizeString from 'humanize-string'

interface loginType {
  title?: string
  subtitle?: JSX.Element | JSX.Element[]
  subtext?: JSX.Element | JSX.Element[]
}

interface FormData {
  email: string
  password: string
}

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
})

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [loading, setLoading] = useState(false)
  const [errorData, setErrorData] = useState([''])

  const { login } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/',
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmitHandler = async (values: FormData) => {
    try {
      login({
        email: values.email,
        password: values.password,
        setErrors: setErrorData,
        setLoading,
      })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <Stack>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="username"
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
          <Box mt="25px">
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
                color={'error'}
              >
                {humanizeString(errors.password.message ?? '')}
              </Typography>
            )}
          </Box>
          <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
            <Typography
              component={Link}
              href="/"
              fontWeight="500"
              sx={{
                textDecoration: 'none',
                color: 'primary.main',
              }}
            >
              Forgot Password ?
            </Typography>
          </Stack>
        </Stack>
        <Box>
          {errorData.length > 0 && (
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              mb="5px"
              color={'error'}
            >
              {errorData[0]}
            </Typography>
          )}
          <CustomButton
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={loading ? true : false}
          >
            {loading ? 'Signing you in...' : 'Sign In'}
          </CustomButton>
        </Box>
        {subtitle}
      </form>
    </>
  )
}

export default AuthLogin
