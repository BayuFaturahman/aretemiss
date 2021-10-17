export type CoachingActivitiesType = 'weekly_coaching' | 'kumpul_santai' | 'coached'

export type CoachingActivitiesItem = {
  type: CoachingActivitiesType
  title: string
  id: string
  coachedBy?: string
  isTagged: boolean
}

export type CoachingJournalItem = {
  date: string
  activities: Array<CoachingActivitiesItem>
}
