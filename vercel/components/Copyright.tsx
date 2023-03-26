import { default as MuiLink } from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import NextLink from 'next/link'
import type { FunctionComponent } from 'react'

const Copyright: FunctionComponent = () => (
  <Typography variant="body2" color="text.secondary" align="center">
    {'Copyright © '}
    <MuiLink href="https://skhaz.dev" component={NextLink} color="inherit">Rodrigo Delduca</MuiLink>
    {' '}
    {new Date().getFullYear()}
    {'.'}
  </Typography>
)

export default Copyright
