import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

import CallableContext = functions.https.CallableContext

export type Context =
  | {
      auth?: {
        uid: string
      }
      rawRequest?: {
        headers: Record<string, unknown>
      }
    }
  | CallableContext

export type EventContext = functions.EventContext

export type Firestore = FirebaseFirestore.Firestore

export type QueryDocumentSnapshot = functions.firestore.QueryDocumentSnapshot

export type DocumentData = admin.firestore.DocumentData

export type UserRecord = admin.auth.UserRecord

export type KeyValue = Record<string, Record<string, string>>
