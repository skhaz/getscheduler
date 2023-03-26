import Alarm from '@mui/icons-material/Alarm'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Copyright from 'components/Copyright'
import type { NextPage } from 'next'
import NextLink from 'next/link'

const Home: NextPage = () => (
  <>
    <AppBar position="relative">
      <Toolbar>
        <Alarm sx={{ mr: 2 }} />
        <Typography variant="h6" color="inherit" noWrap>
          Get Scheduler
        </Typography>
      </Toolbar>
    </AppBar>
    <main>
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
            Schedule anytime
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Easy and realiable online free cron jobs
          </Typography>
          <Stack sx={{ pt: 4 }} direction="row" spacing={2} justifyContent="center">
            <Button href="/dashboard" component={NextLink} variant="contained">Dashboard</Button>
            <Button href="/help" component={NextLink} variant="outlined">Help</Button>
          </Stack>
        </Container>
      </Box>
    </main>
    <Box component="footer">
      <Typography variant="subtitle1" align="center" color="text.secondary" component="p">
        Built with Google Cloud & Firebase
      </Typography>
      <Copyright />
    </Box>
  </>
)

export default Home
