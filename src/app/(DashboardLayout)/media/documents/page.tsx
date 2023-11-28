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
  Fade,
  Grid,
  IconButton,
  Paper,
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
import Image from 'next/image'
import { ContentCopy, DownloadOutlined } from '@mui/icons-material'
import getSignedInUser from '@/utils/getSignedInUser'
import { useSettingsStore } from '@/hooks/settings'
import moment from 'moment'

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
  image: '/images/header/documents.svg',
}

const DocumentsPage = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [showUpload, setShowUpload] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [deleteDialogData, setdeleteDialogData] = useState<Media | null>(null)

  const [copyPublicUrl, setCopyPublicUrl] = useState(false)

  const dateFormat = useSettingsStore.getState().getSettingByKey('date-format')
  const timeFormat = useSettingsStore.getState().getSettingByKey('time-format')

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

  const handleCopyToClipboard = (text: string) => {
    copy(text)
    setCopyPublicUrl(true)
    enqueueSnackbar(`Document url has been copied to clipboard`, {
      variant: 'success',
      anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
    })
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
        <DashboardCard headerAction={addNewButtonSkeleton}>
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

      <Fade in={showUpload}>
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            height: showUpload ? '200px' : 0,
            opacity: showUpload ? 1 : 0,
            mb: 3,
            borderWidth: '2px',
            borderStyle: 'dashed',
            borderColor: 'grey.300',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            borderRadius: 3,
          }}
          {...getRootProps({ className: 'dropzone' })}
        >
          <input {...getInputProps()} />
          <Image
            src={'/images/other/upload.svg'}
            alt="Upload"
            width={150}
            height={100}
            style={{ opacity: showUpload ? 1 : 0 }}
          ></Image>
          <Typography sx={{ opacity: showUpload ? 1 : 0, mt: 2 }}>
            Drag and drop some files here, or click to select file
          </Typography>
        </Paper>
      </Fade>

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
                      File Name
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Size
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Uploaded by
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Uploaded at
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
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {getSignedInUser()?.id === media.user?.id ? 'You' : media.user?.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {moment(media.createdAt).format(dateFormat + ' ' + timeFormat)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="success"
                        aria-label="Copy URL"
                        onClick={() => {
                          handleCopyToClipboard(media.url)
                        }}
                      >
                        <ContentCopy />
                      </IconButton>

                      <IconButton
                        color="primary"
                        aria-label="Download"
                        onClick={() => {
                          handleOpenInNewTab(media.url)
                        }}
                      >
                        <DownloadOutlined />
                      </IconButton>

                      <IconButton
                        color="error"
                        aria-label="Delete file"
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
        ) : (
          <Typography sx={{ textAlign: 'center' }}>No documents found</Typography>
        )}
      </DashboardCard>

      <Dialog open={openDeleteDialog} onClose={handleClose}>
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent dividers sx={{ width: { xs: '280px', sm: '500px' } }}>
          <p>
            Are you sure want to delete{' '}
            {deleteDialogData ? getFileNameFromUrl(deleteDialogData.url) : 'this file'}?
          </p>
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
