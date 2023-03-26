import type { TextFieldProps } from '@mui/material/TextField'
import { default as MuiTextField } from '@mui/material/TextField'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'

interface Props<T extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  control: Control<T>
  name: FieldPath<T>
}

const TextField = <T extends FieldValues>(props: Props<T>) => {
  const { control, name, ...rest } = props

  return (
    <Controller
      render={({ field, fieldState: { error } }) => (
        <MuiTextField
          id={name}
          error={Boolean(error)}
          helperText={error?.message && error.message}
          {...field}
          {...rest}
        />
      )}
      name={name}
      control={control}
    />
  )
}

export default TextField
