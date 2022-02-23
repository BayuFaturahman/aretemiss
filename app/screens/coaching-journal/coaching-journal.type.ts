import { JournalLearnerModel } from "app/store/store.coaching"

export type CoachingActivitiesType = "coaching" | 'coached'

export type CoachingActivitiesItem = {
  type: CoachingActivitiesType
  title: string
  id: string
  coachedBy?: string
  isTagged: boolean
  coach_fullname: string
  coach_id: string
  is_coachee: boolean
  // jl_id: string
  journal_created_at: string
  journal_date: string
  journal_id: string
  journal_title: string
  journal_type: CoachingActivitiesType
  // learner_fullname: string
  // learner_id: string
  journal_learner: JournalLearnerModel[]
}

export type CoachingJournalItem = {
  date: string
  activities: Array<CoachingActivitiesItem>
}
