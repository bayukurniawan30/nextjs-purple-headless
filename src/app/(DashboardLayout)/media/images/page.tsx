'use client'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  OutlinedInput,
  Paper,
  Skeleton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer'
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard'
import useSWR, { mutate } from 'swr'
import axios from '@/lib/axios'
import { ListData, Media, Setting } from '@/type/api'
import CustomButton from '../../components/shared/CustomButton'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import CustomSnackbar from '../../components/forms/theme-elements/CustomSnackbar'
import PageHeader, { PageMeta } from '../../components/shared/PageHeader'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { useDropzone } from 'react-dropzone'
import {
  AspectRatio,
  ContentCopy,
  DeleteOutline,
  DownloadOutlined,
  InsertInvitation,
  InsertPhoto,
  Person,
} from '@mui/icons-material'
import copy from 'copy-to-clipboard'
import prettyBytes from 'pretty-bytes'
import moment from 'moment'
import getSignedInUser from '@/utils/getSignedInUser'
import { useSettingsStore } from '@/hooks/settings'
import DeleteDialog from '../../components/shared/DeleteDialog'

const PageMeta: PageMeta = {
  title: 'Images',
  description: 'Provide images for your app',
  breadcrumb: [
    {
      text: 'Media',
    },
    {
      text: 'Images',
      href: '/media/images',
    },
  ],
  image: '/images/header/images.svg',
}

const GeneralSettingsPage = () => {
  const theme = useTheme()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [dialogData, setDialogData] = useState<Media | null>(null)

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [deleteDialogDialogData, setDeleteDialogDialogData] = useState<Media | null>(null)
  const [disable, setDisable] = useState(false)

  const [copyPublicUrl, setCopyPublicUrl] = useState(false)
  const [copyThumbUrl, setCopyThumbUrl] = useState(false)

  const dateFormat = useSettingsStore.getState().getSettingByKey('date-format')
  const timeFormat = useSettingsStore.getState().getSettingByKey('time-format')

  const mutateKey =
    '/medias?filter=' + JSON.stringify([{ field: 'type', value: 'image', operator: '=' }])

  const imageDialogContainerStyle = {
    'width': '100%',
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center',
    '> img': {
      height: 'auto',
    },
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const formData = new FormData()
      formData.append('file', acceptedFiles[0])

      try {
        await axios.post('/medias', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
      'image/png': ['.png'],
      'image/jpg': ['.jpg', '.jpeg'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
    },
    onDrop,
  })

  const handleOpen = (media: Media) => {
    setOpen(true)
    setDialogData(media)
  }
  const handleClose = () => {
    setOpen(false)
    setDialogData(null)
    setCopyPublicUrl(false)
    setCopyThumbUrl(false)
  }

  const handleCloseDeteleDialog = () => {
    setOpenDeleteDialog(false)
    setDeleteDialogDialogData(null)
  }

  const handleShowUpload = () => setShowUpload((e) => !e)

  const handleCopyToClipboard = (type: 'publicUrl' | 'thumbnailUrl', text: string) => {
    copy(text)
    if (type === 'publicUrl') {
      setCopyPublicUrl(true)
      setCopyThumbUrl(false)
    }
    if (type === 'thumbnailUrl') {
      setCopyThumbUrl(true)
      setCopyPublicUrl(false)
    }
  }

  const handleOpenInNewTab = (url: string) => {
    window.open(url, '_blank')
  }

  const handleDeleteDialog = (media: Media) => {
    setOpenDeleteDialog(true)
    setDeleteDialogDialogData(media)
  }

  const onDeleteHandler = async () => {
    try {
      setDisable(true)

      axios
        .delete(`/medias/${deleteDialogDialogData?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          mutate(mutateKey)
          enqueueSnackbar(`Media has been deleted successfully`, {
            variant: 'success',
            anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
          })
          setOpenDeleteDialog(false)
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
          params: { filter: JSON.stringify([{ field: 'type', value: 'image', operator: '=' }]) },
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
            {Array.from({ length: 4 }, (_, index) => (
              <Grid item xs={3} key={index}>
                <Skeleton sx={{ marginBottom: 1, height: '400px' }} />
              </Grid>
            ))}
          </Grid>
        </DashboardCard>
      </PageContainer>
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

      <DashboardCard headerAction={addNewButton}>
        {data && data.meta.total > 0 ? (
          <Grid container spacing={2}>
            {data.data.map((image) => (
              <Grid item xs={2} md={3} key={image.id}>
                <Image
                  src={image.publicThumbnailUrl}
                  alt={image.publicThumbnailUrl}
                  width={250}
                  height={250}
                  style={{ borderRadius: '8px', cursor: 'pointer' }}
                  onClick={() => handleOpen(image)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography sx={{ textAlign: 'center' }}>No images found</Typography>
        )}
      </DashboardCard>

      <Dialog fullScreen open={open} onClose={handleClose}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1, color: '#ffffff' }} variant="h6" component="div">
              Image Details
            </Typography>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Grid container spacing={2} height={'100vh'}>
          <Grid item xs={4} style={{ position: 'relative' }}>
            <Box sx={{ p: 4 }}>
              <Stack>
                <Box mb={2}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="firstName"
                    mb="5px"
                  >
                    Public URL
                  </Typography>
                  <OutlinedInput
                    id="field-public-url"
                    type="text"
                    fullWidth
                    readOnly
                    value={dialogData?.publicUrl}
                    endAdornment={
                      <InputAdornment position="end">
                        <Tooltip title={copyPublicUrl ? 'Copied' : 'Copy'}>
                          <IconButton
                            aria-label="Copy to clipboard"
                            edge="end"
                            onClick={() =>
                              handleCopyToClipboard('publicUrl', dialogData?.publicUrl as string)
                            }
                          >
                            <ContentCopy />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    }
                  />
                </Box>

                <Box mb={2}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="firstName"
                    mb="5px"
                  >
                    Thumbnail URL
                  </Typography>
                  <OutlinedInput
                    id="field-thumbnail-url"
                    type="text"
                    fullWidth
                    readOnly
                    value={dialogData?.publicThumbnailUrl}
                    endAdornment={
                      <InputAdornment position="end">
                        <Tooltip title={copyThumbUrl ? 'Copied' : 'Copy'}>
                          <IconButton
                            aria-label="Copy to clipboard"
                            edge="end"
                            onClick={() =>
                              handleCopyToClipboard(
                                'thumbnailUrl',
                                dialogData?.publicThumbnailUrl as string
                              )
                            }
                          >
                            <ContentCopy />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    }
                  />
                </Box>
              </Stack>
            </Box>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Box sx={{ pl: 3, pr: 3 }}>
                  <List
                    sx={{
                      width: '100%',
                      maxWidth: 360,
                      bgcolor: 'background.paper',
                    }}
                  >
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          <AspectRatio />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Dimension"
                        secondary={dialogData ? `${dialogData?.width}x${dialogData?.height}` : ''}
                      />
                    </ListItem>
                  </List>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ pl: 3, pr: 3 }}>
                  <List
                    sx={{
                      width: '100%',
                      maxWidth: 360,
                      bgcolor: 'background.paper',
                    }}
                  >
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          <InsertPhoto />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="File size"
                        secondary={dialogData ? `${prettyBytes(dialogData?.size)}` : ''}
                      />
                    </ListItem>
                  </List>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ pl: 3, pr: 3 }}>
                  <List
                    sx={{
                      width: '100%',
                      maxWidth: 400,
                      bgcolor: 'background.paper',
                    }}
                  >
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          <Person />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Uploaded by"
                        secondary={
                          dialogData
                            ? `${
                                getSignedInUser()?.id === dialogData.user?.id
                                  ? 'You'
                                  : dialogData.user?.email
                              }`
                            : ''
                        }
                      />
                    </ListItem>
                  </List>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ pl: 3, pr: 3 }}>
                  <List
                    sx={{
                      width: '100%',
                      maxWidth: 400,
                      bgcolor: 'background.paper',
                    }}
                  >
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          <InsertInvitation />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Uploaded at"
                        secondary={
                          dialogData
                            ? `${moment(dialogData.createdAt).format(
                                dateFormat?.value + ' ' + timeFormat?.value
                              )}`
                            : ''
                        }
                      />
                    </ListItem>
                  </List>
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={2} style={{ position: 'absolute', bottom: 0 }}>
              <Grid item xs={6}>
                <Box sx={{ pl: 4, pr: 2, pb: 4 }}>
                  <Button
                    variant="outlined"
                    disableElevation
                    size="large"
                    startIcon={<DownloadOutlined />}
                    style={{ width: '100%' }}
                    onClick={() => handleOpenInNewTab(dialogData?.publicUrl as string)}
                  >
                    Download
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ pl: 2, pr: 4, pb: 4 }}>
                  <Button
                    variant="contained"
                    color="error"
                    size="large"
                    disableElevation
                    startIcon={<DeleteOutline />}
                    style={{ width: '100%' }}
                    onClick={() => {
                      handleDeleteDialog(dialogData as Media)
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 6,
                backgroundImage: `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAbklEQVQYlY3PsQrCQBRE0RNdWwOxlgX//5eUrNYGYiuyluLbLTLlwFzuDPM833H0yyvn/MYJH+zxTDj7z6jNuMMayhVL6JbUIfSIU8IjOqJxHGqt11iWUg5xnHDZeqYR1zmYMEXxHjHhFh3ROH4Bco8ilihPAOEAAAAASUVORK5CYII=)`,
                backgroundRepeat: 'repeat',
                borderLeft: 1,
                borderColor: 'divider',
              }}
            >
              <div style={imageDialogContainerStyle}>
                <Image
                  src={dialogData ? dialogData?.publicUrl : ''}
                  alt={dialogData ? dialogData?.publicUrl : ''}
                  width={dialogData ? dialogData?.width : 0}
                  height={dialogData ? dialogData?.height : 0}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    height: 'auto',
                  }}
                />
              </div>
            </Box>
          </Grid>
        </Grid>
      </Dialog>

      <DeleteDialog
        open={openDeleteDialog}
        onClose={handleClose}
        onDeleteHandler={onDeleteHandler}
        itemToDelete={'this media'}
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

export default GeneralSettingsPage
