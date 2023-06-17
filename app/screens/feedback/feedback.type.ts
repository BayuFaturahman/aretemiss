export type ExistingCoacheeItem = {
  coachee_id: string
  journal_title: string
  user_fullname: string
  is_button_disabled: number
  has_previous_feedback: number
}

export type FeedbackUserDetail = {
id: string
q1: number
q2: number
q3: number
q4: number
q5: number
from: string
coachId: string
coacheeId: string
fu_created_at: string
fu_updated_at: string
fu_deleted_at: string
has_commitment: number
}

