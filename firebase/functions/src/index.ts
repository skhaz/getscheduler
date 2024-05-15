import * as functions from 'firebase-functions'
import * as providers from './providers'
import * as triggers from './triggers'

const firestore = providers.getFirestore()

const settings = providers.getSettings()

const scheduler = providers.getScheduler()

export const onNewUser = functions.auth.user().onCreate((user) => triggers.onNewUser(firestore, user))

export const onCreateTrigger = functions.firestore
  .document('triggers/{uid}')
  .onCreate((snapshot, context) => triggers.onCreateTrigger(firestore, scheduler, settings, snapshot, context))

export const onDeleteTrigger = functions.firestore
  .document('triggers/{uid}')
  .onDelete((snapshot) => triggers.onDeleteTrigger(firestore, scheduler, snapshot))
