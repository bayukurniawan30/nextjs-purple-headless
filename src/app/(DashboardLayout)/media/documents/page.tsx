'use client'
import { useCallback, useState } from 'react'
import PageHeader, { PageMeta } from '../../components/shared/PageHeader'
import axios from '@/lib/axios'
import useSWR, { mutate } from 'swr'
import { useDropzone } from 'react-dropzone'
import { ListData, Media } from '@/type/api'
import copy from 'copy-to-clipboard'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import CustomButton from '../../components/shared/CustomButton'
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
import PageContainer from '../../components/container/PageContainer'
import DashboardCard from '../../components/shared/DashboardCard'
import { IconPencil, IconTrash } from '@tabler/icons-react'
import CustomSnackbar from '../../components/forms/theme-elements/CustomSnackbar'
import prettyBytes from 'pretty-bytes'
import getFileNameFromUrl from '@/utils/getFileNameFromUrl'

const PageMeta: PageMeta = {
  title: 'Documents',
  description: 'Store documents for your needs',
  breadcrumb: [
    {
      text: 'Media',
    },
    {
      text: 'Documents',
      href: '/media/documents',
    },
  ],
  image: '/images/header/users.svg',
}

const DocumentsPage = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [showUpload, setShowUpload] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [deleteDialogData, setdeleteDialogData] = useState<Media | null>(null)

  const [copyPublicUrl, setCopyPublicUrl] = useState(false)

  const mutateKey =
    '/medias?filter=' + JSON.stringify([{ field: 'type', value: 'document', operator: '=' }])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const formData = new FormData()
      formData.append('file', acceptedFiles[0])

      try {
        await axios.post('/medias', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        mutate(mutateKey)
      } catch (error) {
        console.error('Error uploading files', error)
      }

      // Do something with the files
    },
    [mutateKey]
  )
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt'],
    },
    onDrop,
  })

  const handleShowUpload = () => setShowUpload((e) => !e)

  const handleCopyToClipboard = (type: string, text: string) => {
    copy(text)
    setCopyPublicUrl(true)
  }

  const handleOpenInNewTab = (url: string) => {
    window.open(url, '_blank')
  }

  const handleClose = () => {
    setOpenDeleteDialog(false)
    setdeleteDialogData(null)
    setCopyPublicUrl(false)
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

  const handleDeleteDialog = (media: Media) => {
    setOpenDeleteDialog(true)
    setdeleteDialogData(media)
  }

  const onDeleteHandler = async () => {
    try {
      axios
        .delete(`/medias/${deleteDialogData?.id}`)
        .then((res) => {
          mutate(mutateKey)
          enqueueSnackbar(`Media has been deleted successfully`, {
            variant: 'success',
            anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
          })
          setOpenDeleteDialog(false)
          return res.data
        })
        .catch((err) => err)
    } catch (e) {
      console.log(e)
    }
  }

  const addNewButton = (
    <CustomButton variant="contained" disableElevation onClick={handleShowUpload}>
      Add New
    </CustomButton>
  )

  const addNewButtonSkeleton = <Skeleton sx={{ width: '80px', height: '50px' }} />

  const { data, error, isLoading } = useSWR<ListData<Media>>(
    mutateKey,
    () =>
      axios
        .get('/medias', {
          params: { filter: JSON.stringify([{ field: 'type', value: 'document', operator: '=' }]) },
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
                    URL
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Size
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
              {data?.data.map((media) => (
                <TableRow key={media.id}>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {getFileNameFromUrl(media.url)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {prettyBytes(media.size)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      aria-label="Delete user"
                      onClick={() => {
                        handleDeleteDialog(media)
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
      </DashboardCard>

      <Dialog open={openDeleteDialog} onClose={handleClose}>
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent dividers sx={{ width: { xs: '280px', sm: '500px' } }}>
          <p>Are you sure want to delete {deleteDialogData?.url}</p>
        </DialogContent>
        <DialogActions
          sx={{
            padding: 3,
          }}
        >
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" color="error" disableElevation onClick={onDeleteHandler}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <SnackbarProvider
        Components={{
          success: CustomSnackbar,
          error: CustomSnackbar,
        }}
      />
    </PageContainer>
  )
}

export default DocumentsPage
