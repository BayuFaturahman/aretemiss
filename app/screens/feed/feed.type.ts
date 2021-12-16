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

export type FeedPostCommentType = {
  id: string
  comment: string
  feedId: string
  isOwnComment: boolean
  replyToId: string
  replyToNickname: string
  createdAt: string
  updatedAt: string
  deletedAt: string
  author: {
      id: string
      nickname: string
      title: string
      photo: string
  }
}

export type CreatePostType = {
  "description": string
  "images_url": string
}


export type CreateCommentType = {
  feedId : string
  comment: string
}

export type FeedTimelineItems = {
    // date: string
    posts: Array<FeedItemType>
}
