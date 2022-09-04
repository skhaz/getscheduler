import AddIcon from '@mui/icons-material/Add'
import Alarm from '@mui/icons-material/Alarm'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Fab from 'components/Fab'
import Form from 'components/Form'
import cronstrue from 'cronstrue'
import type { User } from 'firebase/auth'
import { collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore'
import { firestore } from 'providers/firebase'
import { FunctionComponent, useEffect, useState } from 'react'
import Trigger from 'types/trigger'

type Props = {
  user: User
  logout: () => Promise<void>
}

const Item: FunctionComponent<{ trigger: Trigger }> = ({ trigger }) => {
  const handleClick = async ({ id }: Trigger) => {
    if (confirm('Delete trigger?')) {
      await deleteDoc(doc(firestore, 'triggers', id))
    }
  }

  const getPrimary = () => trigger.url

  const getSecondary = () =>
    `${trigger.method} ${cronstrue.toString(trigger.schedule).toLocaleLowerCase()} (${trigger.schedule})`

  return (
    <ListItem disableGutters>
      <ListItemButton onClick={() => handleClick(trigger)}>
        <ListItemText primary={getPrimary()} secondary={getSecondary()} />
      </ListItemButton>
    </ListItem>
  )
}

const List: FunctionComponent<Props> = ({ user, logout }) => {
  const [open, setOpen] = useState(false)

  const [triggers, setTriggers] = useState<Trigger[]>([])

  useEffect(() => {
    const q = query(collection(firestore, 'triggers'), where('user', '==', user.uid))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const triggers: Trigger[] = []

      snapshot.forEach((document) => {
        const { id } = document
        const trigger = { ...document.data(), id } as Trigger
        triggers.push(trigger)
      })

      setTriggers(triggers)
    })

    return () => unsubscribe()
  }, [user.uid])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="relative">
        <Toolbar>
          <Alarm sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            Get Scheduler
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {triggers.map((trigger) => (
          <Item key={trigger.id} trigger={trigger} />
        ))}
      </main>
      <Form user={user} open={open} setOpen={setOpen} />
      <Fab
        onClick={() => {
          setOpen(true)
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  )
}

export default List
