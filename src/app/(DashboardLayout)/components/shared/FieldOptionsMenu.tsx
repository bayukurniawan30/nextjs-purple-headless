import { Menu, MenuItem } from '@mui/material'
import CustomButton from './CustomButton'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useFieldsStore } from '@/hooks/availableFields'
import React from 'react'
import { Field } from '@/type/api'
import { useAddedFields } from '@/hooks/temporaryAddedFields'

interface Props {
  page: 'singleton' | 'collection'
}

const FieldOptionsMenu = ({ page }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const openAddNewFieldMenu = Boolean(anchorEl)
  const availableFields = useFieldsStore.getState().fields
  const handleClickAddNewField = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseAddNewField = () => {
    setAnchorEl(null)
  }
  const handleSelectNewField = (field: Field) => {
    setAnchorEl(null)
    const generateUniqueId = () => {
      return (
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      )
    }
    const uniqueId = generateUniqueId()
    useAddedFields.getState().addNewField({ ...field, page, uniqueId })
    handleCloseAddNewField()
  }

  return (
    <div>
      <CustomButton
        variant="contained"
        disableElevation
        onClick={handleClickAddNewField}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Add New Field
      </CustomButton>
      <Menu
        id="new-field-menu"
        anchorEl={anchorEl}
        open={openAddNewFieldMenu}
        onClose={handleCloseAddNewField}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        slotProps={{
          paper: {
            sx: {
              maxHeight: 48 * 4.5,
              width: '20ch',
            },
          },
        }}
      >
        {availableFields.map((field) => (
          <MenuItem key={field.slug} onClick={() => handleSelectNewField(field)}>
            {field.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default FieldOptionsMenu
