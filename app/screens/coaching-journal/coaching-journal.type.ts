export type CoachingActivitiesType = 'weekly_coaching' | 'gathering' | 'coached'

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
