import { default as MuiLink } from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import NextLink from 'next/link'
import type { FunctionComponent } from 'react'

const Copyright: FunctionComponent = () => (
  <Typography variant="body2" color="text.secondary" align="center">
    {'Copyright © '}
    <NextLink href="https://skhaz.dev" passHref>
      <MuiLink color="inherit">Rodrigo Delduca</MuiLink>
    </NextLink>{' '}
    {new Date().getFullYear()}
    {'.'}
  </Typography>
)

export default Copyright
