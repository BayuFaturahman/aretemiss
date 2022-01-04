export type FeedItemType = {
  id: string
  description: string
  imageUrl: string
  author: {
    id: string
    nickname: string
    title: string
    photo: string
    mood: string
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

export type CommentNotificationType = {
  id: string
  isNew: boolean
  feedId: string
  feedCommentId: string
  feedComment: string
  replyToNickname: string
  type: string
  author: {
    fullName: string
    photo: string
    mood: string
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

export type CreateCommentToType = {
  feedId : string
  comment: string
  replyToId: string
}

export type FeedTimelineItems = {
    // date: string
    posts: Array<FeedItemType>
}
