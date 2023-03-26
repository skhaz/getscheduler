import type { EventContext, Firestore, KeyValue, QueryDocumentSnapshot } from 'types/firebase'
import type { CloudSchedulerClient, protos } from 'types/scheduler'
import { FieldValue } from '../providers'

type Trigger = {
  schedule: string
  timeZone: string
  url: string
  method: string
  success: number
  timeout: number
  retry: number
  user: string
  name?: string
}

export const onCreateTrigger = async (
  firestore: Firestore,
  scheduler: CloudSchedulerClient,
  settings: KeyValue,
  snapshot: QueryDocumentSnapshot,
  context: EventContext
) => {
  const { uid } = context.params
  const parent = scheduler.locationPath(settings.project.id, settings.project.location)
  const trigger = snapshot.data() as Trigger

  const job = {
    appEngineHttpTarget: {
      httpMethod: 'POST' as const,
      headers: { 'Content-Type': 'application/json' },
      body: Buffer.from(
        JSON.stringify({
          url: trigger.url,
          method: trigger.method,
          timeout: trigger.timeout,
          success: trigger.success,
        })
      ),
    },
    schedule: trigger.schedule,
    timeZone: trigger.timeZone,
    description: trigger.user,
    retryConfig: {
      retryCount: trigger.retry,
    },
  } satisfies protos.google.cloud.scheduler.v1.IJob;

  const request = {
    parent: parent,
    job: job,
  } satisfies protos.google.cloud.scheduler.v1.ICreateJobRequest;

  const [response] = await scheduler.createJob(request)
  const { name } = response
  await Promise.all([
    firestore.collection('triggers').doc(uid).update({ name }),
    firestore
      .collection('users')
      .doc(trigger.user)
      .update({ count: FieldValue.increment(1) }),
  ])
}

export const onDeleteTrigger = async (
  firestore: Firestore,
  scheduler: CloudSchedulerClient,
  snapshot: QueryDocumentSnapshot
) => {
  const { name, user } = snapshot.data() as Trigger

  if (name) {
    await scheduler.deleteJob({ name })
  }

  await firestore
    .collection('users')
    .doc(user)
    .update({ count: FieldValue.increment(-1) })
}
