export type FeedTimelineItem = {
  id: string
  imageUrl: string
  author: {
    fullname: string
    nickname: string
    title: string
  }
  description: string
  commentCount: number
  isNew: boolean
  createdAt: string
  updatedAt: string
  comments?: FeedPostComment[]
}

export type FeedPostComment = {
    id: string
    commend: string
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
    posts: Array<FeedTimelineItem> 
}