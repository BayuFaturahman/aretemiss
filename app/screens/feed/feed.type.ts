export type FeedItemType = {
  id: string
  description: string
  imageUrl: string
  author: {
    id: string
    nickname: string
    title: string
    photo: string
  }
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string
  commentCount: number
  isNew: boolean
}

export type FeedPostComment = {
  id: string
  comment: string
  isOwnComment: boolean
  isDeleted: number
  createdAt: string
  updatedAt: string
  author: {
      fullname: string
      nickname: string
      title: string
  }
  feedId: string
}

export type FeedTimelineItems = {
    // date: string
    posts: Array<FeedItemType>
}
