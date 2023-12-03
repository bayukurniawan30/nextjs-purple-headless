'use client'
import { useSettingsStore } from '@/hooks/settings'
import axios from '@/lib/axios'
import { Collection, ListData, Singleton } from '@/type/api'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import CustomButton from '../components/shared/CustomButton'
import {
  Box,
  Grid,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import PageContainer from '../components/container/PageContainer'
import PageHeader, { PageMeta } from '../components/shared/PageHeader'
import DashboardCard from '../components/shared/DashboardCard'
import getSignedInUser from '@/utils/getSignedInUser'
import moment from 'moment'
import { IconPencil, IconTrash } from '@tabler/icons-react'
import DeleteDialog from '../components/shared/DeleteDialog'
import CustomSnackbar from '../components/forms/theme-elements/CustomSnackbar'

const PageMeta: PageMeta = {
  title: 'Singletons',
  description: 'Create a singleton of data for your website and app',
  breadcrumb: [
    {
      text: 'Singletons',
    },
    {
      text: 'Singletons',
      href: '/singletons',
    },
  ],
  image: '/images/header/documents.svg',
}

const SingletonsPage = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [showUpload, setShowUpload] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [deleteDialogData, setdeleteDialogData] = useState<Singleton | null>(null)
  const [disable, setDisable] = useState(false)

  const dateFormat = useSettingsStore.getState().getSettingByKey('date-format')
  const timeFormat = useSettingsStore.getState().getSettingByKey('time-format')

  const mutateKey = '/singletons'

  const handleClose = () => {
    setOpenDeleteDialog(false)
    setdeleteDialogData(null)
  }

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
    setTimeout(() => {
      mutate(mutateKey)
    }, 500)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
    setTimeout(() => {
      mutate(mutateKey)
    }, 500)
  }

  const handleDeleteDialog = (singleton: Singleton) => {
    setOpenDeleteDialog(true)
    setdeleteDialogData(singleton)
  }

  const onDeleteHandler = async () => {
    try {
      setDisable(true)

      axios
        .delete(`/singletons/${deleteDialogData?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          mutate(mutateKey)
          enqueueSnackbar(`Singleton has been deleted successfully`, {
            variant: 'success',
            anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
          })
          setOpenDeleteDialog(false)
          return res.data
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

  const addNewButton = (
    <CustomButton variant="contained" disableElevation>
      Add New
    </CustomButton>
  )

  const addNewButtonSkeleton = <Skeleton sx={{ width: '80px', height: '50px' }} />

  const { data, error, isLoading } = useSWR<ListData<Collection>>(
    mutateKey,
    () =>
      axios
        .get('/singletons', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          return res.data
        })
        .catch((err) => err),
    {
      fallbackData: {
        data: [],
        meta: {
          total: 0,
        },
      },
    }
  )

  if (error) return <div>failed to load</div>
  if (isLoading)
    return (
      <PageContainer title={PageMeta.title} description={PageMeta.description}>
        <PageHeader
          title={PageMeta.title}
          breadcrumb={PageMeta.breadcrumb}
          image={PageMeta.image}
        />
        <DashboardCard headerAction={addNewButtonSkeleton}>
          <Grid container spacing={2}>
            {Array.from({ length: 6 }, (_, index) => (
              <Grid item xs={2} sm={2} md={2} key={index}>
                <Skeleton sx={{ marginBottom: 1 }} />
                <Skeleton sx={{ marginBottom: 1 }} />
                <Skeleton />
              </Grid>
            ))}
          </Grid>
        </DashboardCard>
      </PageContainer>
    )

  const pagination = (
    <Box sx={{ padding: 2 }}>
      <TablePagination
        component="div"
        count={data ? data?.meta.total ?? 0 : 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  )

  return (
    <PageContainer title={PageMeta.title} description={PageMeta.description}>
      <PageHeader title={PageMeta.title} breadcrumb={PageMeta.breadcrumb} image={PageMeta.image} />

      <DashboardCard
        headerAction={addNewButton}
        footer={data && data.meta.total > 0 ? pagination : undefined}
      >
        {data && data.meta.total > 0 ? (
          <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
            <Table
              aria-label="singletons table"
              sx={{
                whiteSpace: 'nowrap',
                mt: 2,
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Name
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Status
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Owned by
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Created at
                    </Typography>
                  </TableCell>
                  <TableCell size="small" align="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Action
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data.map((singleton) => (
                  <TableRow key={singleton.id}>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {singleton.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {singleton.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {getSignedInUser()?.id === singleton.user?.id
                          ? 'You'
                          : singleton.user?.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {moment(singleton.createdAt).format(
                          dateFormat?.value + ' ' + timeFormat?.value
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" aria-label="Details">
                        <IconPencil />
                      </IconButton>

                      <IconButton
                        color="error"
                        aria-label="Delete singleton"
                        onClick={() => {
                          handleDeleteDialog(singleton)
                        }}
                      >
                        <IconTrash />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        ) : (
          <Typography sx={{ textAlign: 'center' }}>No singleton found</Typography>
        )}
      </DashboardCard>

      <DeleteDialog
        open={openDeleteDialog}
        onClose={handleClose}
        onDeleteHandler={onDeleteHandler}
        itemToDelete={deleteDialogData ? deleteDialogData.name : 'this singleton'}
        disable={disable}
      />

      <SnackbarProvider
        Components={{
          success: CustomSnackbar,
          error: CustomSnackbar,
        }}
      />
    </PageContainer>
  )
}

export default SingletonsPage
