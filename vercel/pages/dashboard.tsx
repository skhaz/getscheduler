import List from 'components/List'
import Unauthorized from 'components/Unauthorized'
import { User } from 'firebase/auth'
import { useAuth } from 'hooks/firebase'
import type { NextPage } from 'next'

const Dashboard: NextPage = () => {
  const { user, loading, login, logout } = useAuth()

  const renderUnauthorized = () => <Unauthorized handleLogin={login} />

  const renderList = (user: User, logout: () => Promise<void>) => <List user={user} logout={logout} />

  return (
    <>
      {!loading && !user && renderUnauthorized()}
      {!loading && user && renderList(user, logout)}
    </>
  )
}

export default Dashboard
