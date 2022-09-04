import { default as MuiFab } from '@mui/material/Fab'
import { FunctionComponent, MouseEventHandler } from 'react'

type Props = {
  onClick?: MouseEventHandler<HTMLElement> | undefined
  children: JSX.Element
}

const Fab: FunctionComponent<Props> = ({ children, onClick }) => (
  <MuiFab
    onClick={onClick}
    sx={{
      position: 'fixed',
      bottom: (theme) => theme.spacing(2),
      right: (theme) => theme.spacing(2),
    }}
    color="primary"
  >
    {children}
  </MuiFab>
)

export default Fab
