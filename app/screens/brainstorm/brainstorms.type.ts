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
  title: string
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

export type IdeaPoolsDetail = {
  id: string
  title: string
  description: string
  color: string
  votes: number
  authorId: string
  authorFullname: string
  isSelected: number
  groupInitiatorId: string
  isAuthor: boolean
  isInitiator: boolean
}

export type CpUser = {
  id: string,
  item: string
}
