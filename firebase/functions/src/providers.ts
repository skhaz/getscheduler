import { CloudSchedulerClient } from '@google-cloud/scheduler'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

if (!admin.apps.length) {
  admin.initializeApp()
}

export const { FieldValue } = admin.firestore

const firestore = admin.firestore()

firestore.settings({ ignoreUndefinedProperties: true })

const settings = functions.config().self

export const getFirestore = () => firestore

export const getSettings = () => settings

const scheduler = new CloudSchedulerClient()

export const getScheduler = () => scheduler
