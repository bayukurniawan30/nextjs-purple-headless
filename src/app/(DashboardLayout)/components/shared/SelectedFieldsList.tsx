import React from 'react'
import { List, ListItem, ListItemIcon, ListItemText, IconButton, Typography } from '@mui/material'
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
import { TemporaryField } from '@/hooks/temporaryAddedFields'

type Props = {
  temporaryAddedFields: TemporaryField[]
  onDelete: (uniqueId: string) => void
}

const SelectedFieldsList = ({ temporaryAddedFields, onDelete }: Props) => {
  if (temporaryAddedFields.length > 0) {
    const getIconComponent = (fieldType: string) => {
      switch (fieldType) {
        case 'text-input':
          return IconPencil
        case 'textarea':
          return IconArticle
        case 'selectbox':
          return IconChecklist
        case 'password':
          return IconPassword
        case 'number':
          return IconSquareNumber1
        case 'link':
          return IconLink
        case 'image':
          return IconPhoto
        case 'code-editor':
          return IconCode
        case 'date-picker':
          return IconCalendarEvent
        case 'time-picker':
          return IconClockEdit
        case 'color-picker':
          return IconPalette
        case 'boolean':
          return IconToggleRight
        default:
          return IconPencil
      }
    }

    const handleDelete = (uniqueId: string) => {
      // Call the onDelete prop with the uniqueId
      onDelete(uniqueId)
    }

    return (
      <List>
        {temporaryAddedFields.map((field) => {
          const IconComponent = getIconComponent(field.slug)

          return (
            <ListItem
              key={field.uniqueId}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(field.uniqueId)}
                >
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

export default SelectedFieldsList
