import { default as MuiAutocomplete } from '@mui/material/Autocomplete'
import type { TextFieldProps } from '@mui/material/TextField'
import { default as MuiTextField } from '@mui/material/TextField'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'

interface Props<T extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  control: Control<T>
  name: FieldPath<T>
  options: string[]
}

const Autocomplete = <T extends FieldValues>(props: Props<T>) => {
  const { control, name, options, placeholder, ...rest } = props

  return (
    <Controller
      render={({ field, fieldState: { error } }) => (
        <MuiAutocomplete
          id={name}
          options={options}
          renderInput={(params) => (
            <MuiTextField
              error={Boolean(error)}
              helperText={error?.message && error.message}
              placeholder={placeholder}
              {...params}
              {...rest}
            />
          )}
          {...field}
          onChange={(_event, value) => {
            field.onChange(value)
          }}
        />
      )}
      name={name}
      control={control}
    />
  )
}

export default Autocomplete
