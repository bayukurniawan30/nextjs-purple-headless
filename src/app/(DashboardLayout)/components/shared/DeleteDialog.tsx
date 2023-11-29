import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import React from 'react'

interface Props {
  open: boolean
  onClose: () => void
  onDeleteHandler: () => void
  itemToDelete: string
  disable: boolean
}

const DeleteDialog = ({ open, onClose, onDeleteHandler, itemToDelete, disable }: Props) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Confirmation</DialogTitle>
      <DialogContent dividers sx={{ width: { xs: '280px', sm: '500px' } }}>
        <p>Are you sure want to delete {itemToDelete}?</p>
      </DialogContent>
      <DialogActions
        sx={{
          padding: 3,
        }}
      >
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="error" disableElevation onClick={onDeleteHandler}>
          Delete
        </Button>
        <CircularProgress
          color="error"
          size={24}
          sx={{ marginLeft: 2, display: disable ? 'block' : 'none' }}
        />
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog
