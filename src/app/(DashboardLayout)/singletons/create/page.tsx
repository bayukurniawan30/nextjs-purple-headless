'use client'
import PageHeader, { PageMeta } from '../../components/shared/PageHeader'
import React, { useCallback, useState } from 'react'
import {
  Box,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import CustomButton from '../../components/shared/CustomButton'
import PageContainer from '../../components/container/PageContainer'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import DashboardCard from '../../components/shared/DashboardCard'
import CustomTextField from '../../components/forms/theme-elements/CustomTextField'
import humanizeString from 'humanize-string'
import { SnackbarProvider } from 'notistack'
import CustomSnackbar from '../../components/forms/theme-elements/CustomSnackbar'
import { useRouter } from 'next/navigation'
import CustomSelect from '../../components/forms/theme-elements/CustomSelect'
import FieldOptionsMenu from '../../components/shared/FieldOptionsMenu'
import { useAddedFields } from '@/hooks/temporaryAddedFields'
import {
  IconPencil,
  IconTrash,
  IconChecklist,
  IconArticle,
  IconPassword,
  IconSquareNumber1,
  IconLink,
  IconPhoto,
  IconCode,
  IconClockEdit,
  IconCalendarEvent,
  IconPalette,
  IconToggleRight,
} from '@tabler/icons-react'
import { FIELD_ICONS } from '@/const/fieldIcons'

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
}

const schema = yup.object().shape({
  name: yup.string().required(),
  status: yup.string().required(),
})

const CreateSingletonPage = () => {
  const router = useRouter()
  const [disable, setDisable] = useState(false)

  const temporaryAddedFields = useAddedFields().fields
  // const selectedFields = () => {
  //   return (

  //   )
  // }
  const showEmptyField = () => {
    return (
      <Typography sx={{ textAlign: 'center' }}>
        Please add fields by clicking the button above
      </Typography>
    )
  }
  // const showSelectedFields = () => {
  //   if (temporaryAddedFields.length > 0) {
  //     showSelectedFields()
  //   } else {
  //     showEmptyField()
  //   }
  // }

  const showSelectedFields = () => {
    if (temporaryAddedFields.length > 0) {
      return (
        <List>
          {temporaryAddedFields.map((field) => {
            const matchingIcon = FIELD_ICONS.find((icon) => icon.type === field.slug)

            const IconComponent = matchingIcon ? matchingIcon.icon : IconPencil

            return (
              <ListItem
                key={field.uniqueId}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete">
                    <IconTrash />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <IconComponent />
                </ListItemIcon>
                <ListItemText primary={field.name} />
              </ListItem>
            )
          })}
        </List>
      )
    } else {
      return (
        <Typography sx={{ textAlign: 'center' }}>
          Please add fields by clicking the button above
        </Typography>
      )
    }
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
    },
  })
  const onSubmitHandler = async (values: FormData) => {}

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
                            labelId="setting-value"
                            id="setting-value"
                            label="Value"
                            input={<CustomSelect />}
                            {...field}
                          >
                            <MenuItem key={'draft'} value={'Draft'}>
                              Draft
                            </MenuItem>
                            <MenuItem key={'publish'} value={'Publish'}>
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
                {showSelectedFields()}
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
