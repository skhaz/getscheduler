type Trigger = {
  id: string
  schedule: string
  timeZone: string
  url: string
  method: string
  success: number
  timeout: number
  retry: number
  name?: string
}

export default Trigger
