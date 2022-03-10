export type BrainstormGroupType = {
  id: string
  initiatorId: string
  name: string
  icon: string
  bg_created_at: string
  bg_updated_at: string
  bg_deleted_at: null
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
  description: string
  images_url: string
  type_id: string
}

export type CreateCommentType = {
  feedId: string
  comment: string
}

export type CreateCommentToType = {
  feedId: string
  comment: string
  replyToId: string
}

export type FeedTimelineItems = {
  // date: string
  posts: Array<FeedItemType>
}

export type FeedCategoryType = {
  id: string
  item: string
  key: string
}
