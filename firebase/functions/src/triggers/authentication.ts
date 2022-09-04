import type { Firestore, UserRecord } from 'types/firebase'
import { copyProps } from '../helpers'

export const onNewUser = async (firestore: Firestore, user: UserRecord) => {
  const { uid } = user

  return firestore
    .collection('users')
    .doc(uid)
    .set({ ...copyProps(user, ['email', 'displayName', 'photoURL']), count: 0 })
}
