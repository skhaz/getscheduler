import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Stack from '@mui/material/Stack'
import Autocomplete from 'components/Autocomplete'
import TextField from 'components/TextField'
import { isValidCron } from 'cron-validator'
import cronstrue from 'cronstrue'
import type { User } from 'firebase/auth'
import { addDoc, collection } from 'firebase/firestore'
import defaults from 'helpers/defaults'
import { firestore } from 'providers/firebase'
import { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

const schema = yup.object().shape({
  url: yup
    .string()
    .test((value) => {
      if (value) {
        try {
          const url = new URL(value)
          return url.protocol === 'http:' || url.protocol === 'https:'
        } catch (_) {
          return false
        }
      }

      return true
    })
    .required(),

  schedule: yup
    .string()
    .test((value) => {
      if (value) {
        return isValidCron(value)
      }

      return true
    })
    .required(),

  timeZone: yup
    .string()
    .test((value) => {
      if (value) {
        try {
          Intl.DateTimeFormat(undefined, { timeZone: value })
          return true
        } catch (_) {
          return false
        }
      }

      return true
    })
    .required(),

  method: yup
    .string()
    .test((value) => {
      if (value) {
        return defaults.http.methods.includes(value)
      }

      return true
    })
    .required(),

  success: yup.number().positive().min(defaults.success.minimum).max(defaults.success.maximum).required(),

  timeout: yup.number().positive().min(defaults.timeout.minimum).max(defaults.timeout.maximum).required(),

  retry: yup.number().positive().min(defaults.retry.minimum).max(defaults.retry.maximum).required(),
})

type Props = {
  user: User
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

type FormValues = {
  url: string
  schedule: string
  timeZone: string
  method: string
  success: number
  timeout: number
  retry: number
}

const Form: FunctionComponent<Props> = ({ user, open, setOpen }) => {
  const [description, setDescription] = useState(defaults.description)

  const { control, handleSubmit, reset, watch } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: defaults.form,
  })

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      const { url, schedule, method } = value

      setDescription(defaults.description)

      if (url && schedule && method && isValidCron(schedule)) {
        setDescription(`Will do an HTTP ${method} on ${url} ${cronstrue.toString(schedule).toLocaleLowerCase()}.`)
      }
    })

    return () => subscription.unsubscribe()
  }, [watch])

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await addDoc(collection(firestore, 'triggers'), { ...data, user: user.uid })
    reset()
    setOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Add a new trigger</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText>{description}</DialogContentText>
            <DialogContentText></DialogContentText>
            <TextField
              fullWidth
              type="url"
              label="URL"
              name="url"
              control={control}
              placeholder="https://httpbin.org/status/200"
            />
            <TextField
              fullWidth
              type="text"
              label="Schedule"
              name="schedule"
              control={control}
              placeholder="* * * * *"
            />
            <TextField
              fullWidth
              type="number"
              label="Success"
              name="success"
              control={control}
              placeholder="200"
              inputProps={{ min: defaults.success.minimum, max: defaults.success.maximum }}
            />
            <Autocomplete
              fullWidth
              options={defaults.timezones}
              type="text"
              label="Time zone"
              name="timeZone"
              control={control}
              placeholder="UTC"
            />
            <Autocomplete
              fullWidth
              options={defaults.http.methods}
              type="text"
              label="Method "
              name="method"
              control={control}
              placeholder="POST"
            />
            <TextField
              fullWidth
              type="number"
              label="Timeout"
              name="timeout"
              control={control}
              inputProps={{ min: defaults.timeout.minimum, max: defaults.timeout.maximum }}
            />
            <TextField
              fullWidth
              type="number"
              label="Retry"
              name="retry"
              control={control}
              inputProps={{ min: defaults.retry.minimum, max: defaults.retry.maximum }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default Form
