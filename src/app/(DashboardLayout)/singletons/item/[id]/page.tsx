'use client'
import PageHeader, { PageMeta } from '@/app/(DashboardLayout)/components/shared/PageHeader'
import { FieldSchema, SingletonWithItem } from '@/type/api'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import axios from '@/lib/axios'
import * as yup from 'yup'
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer'
import { Box, CircularProgress, Grid, Stack, Typography } from '@mui/material'
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard'
import { TemporaryField, useAddedFields } from '@/hooks/temporaryAddedFields'
import { useFieldsStore } from '@/hooks/availableFields'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import CustomButton from '@/app/(DashboardLayout)/components/shared/CustomButton'
import TextareaField from '@/app/(DashboardLayout)/components/forms/field-schemas/TextareaField'
import TextInputField from '@/app/(DashboardLayout)/components/forms/field-schemas/TextInputField'
import SelectField from '@/app/(DashboardLayout)/components/forms/field-schemas/SelectField'
import BooleanField from '@/app/(DashboardLayout)/components/forms/field-schemas/BooleanField'
import PasswordField from '@/app/(DashboardLayout)/components/forms/field-schemas/PasswordField'
import DatePickerField from '@/app/(DashboardLayout)/components/forms/field-schemas/DatePickerField'
import TimePickerField from '@/app/(DashboardLayout)/components/forms/field-schemas/TImePickerField'
import moment from 'moment'
import ColorPickerField from '@/app/(DashboardLayout)/components/forms/field-schemas/ColorPickerField'
import CodeEditorField from '@/app/(DashboardLayout)/components/forms/field-schemas/CodeEditorField'

interface DynamicForm {
  [key: string]: yup.StringSchema | yup.NumberSchema // Define other schema types as needed
}

const SingletonItemPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const [disable, setDisable] = useState(false)

  const addedFields = useAddedFields()
  const constructedFields = useAddedFields().fields
  console.log('🚀 ~ SingletonItemPage ~ constructedFields:', constructedFields)
  const availableFields = useFieldsStore.getState().fields

  const PageMeta: PageMeta = {
    title: 'Singleton Item',
    description: 'Edit singleton item',
    breadcrumb: [
      {
        text: 'Content',
      },
      {
        text: 'Singletons',
        href: '/singletons',
      },
      {
        text: 'Item',
        href: `/singletons/item/${params.id}`,
      },
    ],
    image: '/images/header/singletons.svg',
  }

  const { data, error, isLoading } = useSWR<SingletonWithItem>(
    `/singletons/${params.id}/item`,
    () =>
      axios
        .get(`/singletons/${params.id}/item`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          return res.data
        })
        .catch((err) => err)
  )

  useEffect(() => {
    addedFields.clearAll()

    setTimeout(() => {
      data?.fields.map((field: FieldSchema) => {
        // find id in availableFields
        const availableField = availableFields.find((f) => f.id === field.id)
        if (availableField) {
          addedFields.addNewField({
            ...availableField,
            id: field.id,
            uniqueId: field.uniqueId,
            label: field.label,
            helperText: field.helperText,
            metadata: field.metadata,
          } as TemporaryField)
        }
      })
    }, 500)
  }, [data])

  const generateYupSchema = (fields: TemporaryField[]) => {
    const schema: DynamicForm = {}

    fields.forEach((field) => {
      switch (field.slug) {
        case 'text-input':
        case 'textarea':
          schema[field.uniqueId] = yup.string()
          if (field.metadata?.minLength !== undefined) {
            schema[field.uniqueId] = schema[field.uniqueId].min(
              field.metadata.minLength,
              'Value must be at least ' + field.metadata.minLength + ' characters long'
            )
          }
          if (field.metadata?.maxLength !== undefined) {
            schema[field.uniqueId] = schema[field.uniqueId].max(
              field.metadata.maxLength,
              'Value must be at most ' + field.metadata.maxLength + ' characters long'
            )
          }
          break

        case 'number':
          schema[field.uniqueId] = yup
            .number()
            .positive()
            .integer()
            .min(field.metadata.min, 'Value have to be larger or same as ' + field.metadata.min)
            .max(field.metadata.max, 'Value have to be smaller or same as ' + field.metadata.max)
            .typeError('Value must be a number')
          break

        case 'link':
          schema[field.uniqueId] = yup.string().url().typeError('Value must be a valid URL')
          break

        default:
          schema[field.uniqueId] = yup.string()
          break
      }
    })

    return yup.object().shape(schema)
  }

  const dynamicYupSchema = generateYupSchema(constructedFields)
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(dynamicYupSchema),
  })

  const onSubmitHandler = async (values: DynamicForm) => {
    console.log('🚀 ~ file: page.tsx:178 ~ onSubmitHandler ~ values:', values)
    try {
      // setDisable(true)
      // axios
      //   .put(
      //     `/singletons/${params.id}`,
      //     {},
      //     {
      //       headers: {
      //         Authorization: `Bearer ${localStorage.getItem('token')}`,
      //       },
      //     }
      //   )
      //   .then((res) => {
      //     if (res.status === 200) {
      //       enqueueSnackbar(`Singleton has been updated successfully`, {
      //         variant: 'success',
      //         anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
      //       })
      //       setTimeout(() => {
      //         addedFields.clearAll()
      //         router.push('/singletons')
      //       }, 1000)
      //     } else {
      //       setDisable(false)
      //       enqueueSnackbar(`Failed to update existng singleton. Please try again`, {
      //         variant: 'error',
      //         anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
      //       })
      //     }
      //   })
      //   .catch((err) => {
      //     setDisable(false)
      //     err
      //   })
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
          <DashboardCard title={data?.name} footer={footer}>
            <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
              <Stack>
                {constructedFields.map((fieldData) => {
                  let fieldComponent

                  switch (fieldData.slug) {
                    case 'text-input':
                    case 'number':
                      fieldComponent = (
                        <TextInputField
                          key={fieldData.uniqueId}
                          name={fieldData.uniqueId}
                          label={fieldData.label}
                          helperText={fieldData.helperText}
                          control={control}
                          errors={errors}
                          inputProps={fieldData.metadata}
                        ></TextInputField>
                      )
                      break

                    case 'textarea':
                      fieldComponent = (
                        <TextareaField
                          key={fieldData.uniqueId}
                          name={fieldData.uniqueId}
                          label={fieldData.label}
                          helperText={fieldData.helperText}
                          control={control}
                          errors={errors}
                          inputProps={fieldData.metadata}
                        ></TextareaField>
                      )
                      break

                    case 'link':
                      fieldComponent = (
                        <TextInputField
                          key={fieldData.uniqueId}
                          name={fieldData.uniqueId}
                          label={fieldData.label}
                          helperText={fieldData.helperText}
                          control={control}
                          errors={errors}
                          inputProps={fieldData.metadata}
                        ></TextInputField>
                      )
                      break

                    case 'selectbox':
                      fieldComponent = (
                        <SelectField
                          key={fieldData.uniqueId}
                          name={fieldData.uniqueId}
                          label={fieldData.label}
                          helperText={fieldData.helperText}
                          control={control}
                          errors={errors}
                          inputProps={fieldData.metadata}
                        ></SelectField>
                      )
                      break

                    case 'password':
                      fieldComponent = (
                        <PasswordField
                          key={fieldData.uniqueId}
                          name={fieldData.uniqueId}
                          label={fieldData.label}
                          helperText={fieldData.helperText}
                          control={control}
                          errors={errors}
                          inputProps={fieldData.metadata}
                        ></PasswordField>
                      )
                      break

                    case 'boolean':
                      fieldComponent = (
                        <BooleanField
                          key={fieldData.uniqueId}
                          name={fieldData.uniqueId}
                          label={fieldData.label}
                          helperText={fieldData.helperText}
                          control={control}
                          errors={errors}
                          inputProps={fieldData.metadata}
                        ></BooleanField>
                      )
                      break

                    case 'date-picker':
                      fieldComponent = (
                        <DatePickerField
                          key={fieldData.uniqueId}
                          name={fieldData.uniqueId}
                          label={fieldData.label}
                          helperText={fieldData.helperText}
                          control={control}
                          errors={errors}
                          inputProps={fieldData.metadata}
                          onChange={(key, value) => {
                            const date = moment(value).format(fieldData.metadata.format)
                            setValue(key, date)
                          }}
                        ></DatePickerField>
                      )
                      break

                    case 'time-picker':
                      fieldComponent = (
                        <TimePickerField
                          key={fieldData.uniqueId}
                          name={fieldData.uniqueId}
                          label={fieldData.label}
                          helperText={fieldData.helperText}
                          control={control}
                          errors={errors}
                          inputProps={fieldData.metadata}
                          onChange={(key, value) => {
                            const time = moment(value).format(fieldData.metadata.format)
                            setValue(key, time)
                          }}
                        ></TimePickerField>
                      )
                      break

                    case 'color-picker':
                      fieldComponent = (
                        <ColorPickerField
                          key={fieldData.uniqueId}
                          name={fieldData.uniqueId}
                          label={fieldData.label}
                          helperText={fieldData.helperText}
                          control={control}
                          errors={errors}
                          inputProps={fieldData.metadata}
                          onChange={(key, value) => {
                            setValue(key, value)
                          }}
                        ></ColorPickerField>
                      )
                      break

                    case 'code-editor':
                      console.log('code editor comp')
                      fieldComponent = (
                        <CodeEditorField
                          key={fieldData.uniqueId}
                          name={fieldData.uniqueId}
                          label={fieldData.label}
                          helperText={fieldData.helperText}
                          control={control}
                          errors={errors}
                          inputProps={fieldData.metadata}
                          onChange={(key, value) => {
                            setValue(key, value)
                          }}
                        ></CodeEditorField>
                      )
                      break

                    case 'image':
                      console.log('image comp')
                      fieldComponent = <p>asdasd image</p>
                      break

                    default:
                      fieldComponent = null
                  }

                  return fieldComponent
                })}
              </Stack>
            </Box>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <DashboardCard title="Content Filling">
            <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
              <Typography variant="subtitle1" component="label" mb="5px">
                The field schemas is based on the fields that are created in the singleton.
              </Typography>
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

export default SingletonItemPage
