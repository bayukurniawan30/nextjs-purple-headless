'use client'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer'
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard'
import useSWR, { mutate } from 'swr'
import axios from '@/lib/axios'
import { ListData, User } from '@/type/api'
import { IconCheck, IconPencil, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import CustomSnackbar from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomSnackbar'
import PageHeader, { PageMeta } from '@/app/(DashboardLayout)/components/shared/PageHeader'
import CustomButton from '@/app/(DashboardLayout)/components/shared/CustomButton'
import { useRouter } from 'next/navigation'
import DeleteDialog from '../../components/shared/DeleteDialog'

const PageMeta: PageMeta = {
  title: 'Users',
  description: 'List of User',
  breadcrumb: [
    {
      text: 'Settings',
    },
    {
      text: 'Users',
      href: '/settings/users',
    },
  ],
  image: '/images/header/users.svg',
}

const UsersPage = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [dialogData, setDialogData] = useState<User | null>(null)
  const [disable, setDisable] = useState(false)

  const handleClickOpen = (user: User) => {
    setOpen(true)
    setDialogData(user)
  }

  const handleClose = () => {
    setOpen(false)
    setDialogData(null)
  }

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
    setTimeout(() => {
      mutate('/users')
    }, 500)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
    setTimeout(() => {
      mutate('/users')
    }, 500)
  }

  const handleGotoEdit = (user: User) => {
    router.push(`/settings/users/edit/${user.id}`)
  }

  const onSubmitHandler = async () => {
    try {
      setDisable(true)

      axios
        .delete(`/users/${dialogData?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          mutate('/users')
          enqueueSnackbar(`${dialogData?.email} has been deleted successfully`, {
            variant: 'success',
            anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
          })
          setOpen(false)
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

  const { data, error, isLoading } = useSWR<ListData<User>>(
    '/users',
    () =>
      axios
        .get('/users', {
          params: {
            sort: 'created_at',
            order: 'desc',
            page: page + 1,
            limit: rowsPerPage,
          },
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
        <DashboardCard title={PageMeta.title}>
          <Grid container spacing={2}>
            {Array.from({ length: 3 }, (_, index) => (
              <Grid item xs={4} key={index}>
                <Skeleton sx={{ marginBottom: 1 }} />
                <Skeleton sx={{ marginBottom: 1 }} />
                <Skeleton />
              </Grid>
            ))}
          </Grid>
        </DashboardCard>
      </PageContainer>
    )

  const addNewButton = (
    <CustomButton
      variant="contained"
      disableElevation
      onClick={() => router.push('/settings/users/create')}
    >
      Add New
    </CustomButton>
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
      <DashboardCard headerAction={addNewButton} footer={pagination}>
        {data && data.meta.total > 0 ? (
          <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
            <Table
              aria-label="users table"
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
                      Email
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Admin
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
                {data?.data.map((user) => (
                  <TableRow key={user.email}>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {user.profile.fullName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2" fontWeight={600}>
                        {user.isAdmin ? <IconCheck /> : null}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        aria-label="Details"
                        onClick={() => {
                          handleGotoEdit(user)
                        }}
                      >
                        <IconPencil />
                      </IconButton>
                      <IconButton
                        color="error"
                        aria-label="Delete user"
                        onClick={() => {
                          handleClickOpen(user)
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
          <Typography sx={{ textAlign: 'center' }}>No users found</Typography>
        )}
      </DashboardCard>

      <DeleteDialog
        open={open}
        onClose={handleClose}
        onDeleteHandler={onSubmitHandler}
        itemToDelete={dialogData?.profile.fullName ?? 'this user'}
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

export default UsersPage
