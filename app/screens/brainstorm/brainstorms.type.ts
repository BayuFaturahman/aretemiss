export type BrainstormGroupType = {
  id: string
  initiatorId: string
  name: string
  icon: string
  bg_created_at: string
  bg_updated_at: string
  bg_deleted_at: null
}

export type IdeaType = {
  id: string
  // brainstormGroupId: string
  // title: string
  description: string
  color: string
  colorShade: string
  // is_selected: number
  // votes: number
}

export type IdeaPoolsByGroupType = {
  brainstormed: IdeaType[]
  shortlisted: IdeaType[]
  selected: IdeaType[]
}
