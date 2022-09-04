import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import type { FunctionComponent, MouseEvent } from 'react'

type Props = {
  handleLogin: (event: MouseEvent<HTMLButtonElement>) => void
}

const Unauthorized: FunctionComponent<Props> = ({ handleLogin }) => (
  <Grid
    container
    spacing={0}
    direction="column"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: '100vh' }}
  >
    <Grid item>
      <Button variant="contained" onClick={handleLogin}>
        Sign in with Google
      </Button>
    </Grid>
  </Grid>
)

export default Unauthorized
