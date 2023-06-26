/* eslint-disable max-lines */
// #region IMPORTS
// PACKAGES
import ServiceStore from "./store.service"
import { Api } from "@services/api"
import { FeedApi } from "@services/api/feed/feed-api"
import { ErrorFormResponse, FeedApiModel } from "@services/api/feed/feed-api.types"
import { CommentNotificationType, FeedCategoryType, FeedItemType, FeedPostCommentType } from "@screens/feed/feed.type"
import { CultureMeasurementApi } from "@services/api/cultureMeasurement/culture-measurement-api"


export default class CultureMeasurementStore {
    // #region PROPERTIES

    serviceStore: ServiceStore
    api: Api
    isLoading: boolean

    refreshData: boolean

    errorCode: number
    errorMessage: string

    cmApi: CultureMeasurementApi
    postDetail: FeedItemType
    listFeeds: FeedItemType[]
    listMyFeed: FeedItemType[]
    listComment: FeedPostCommentType[]
    listCommentNotif: CommentNotificationType[]
    newNotif: number

    listFeedCategory: FeedCategoryType[]

    constructor(serviceStore: ServiceStore, api: Api) {
        this.serviceStore = serviceStore
        this.api = api
        this.isLoading = false

        this.refreshData = false

        this.errorCode = null
        this.errorMessage = null

        this.listFeedCategory = []
        this.postDetail = null
        this.listFeeds = []
        this.listMyFeed = []
        this.cmApi = new CultureMeasurementApi(this.api)
        this.newNotif = 0
    }

    async getListPublish() {
        this.isLoading = true
        try {
            const response = await this.feedApi.getListFeeds(page, limit)

            if (response.kind === "form-error") {
                this.formError(response.response)
            } else if (response.kind === "ok") {
                this.getListFeedsSuccess(response.response.data, response.response.new_notif)
            } else if (response.kind === 'unauthorized') {
                console.log('token expired journal')
                console.log(response)
                this.formError(response.response)
            } else {
                __DEV__ && console.tron.log(response.kind)
            }
        } catch (e) {
            console.log(e)
            this.setErrorMessage(e)
        } finally {
            console.log("getListFeeds done")
            this.isLoading = false
        }
    }

    getListFeedsSuccess(data: FeedApiModel[], notif: number) {
        console.log("getListFeedsSuccess")
        // this.listFeeds = []
        const tempListFeeds: FeedItemType[] = []
        const lastSeen = new Date(this.serviceStore.lastSeenFeed)
        // console.log('lastSeen ', lastSeen , lastSeen.getTime())
        data.forEach(post => {
            const postCreated = new Date(post.feed_created_at)
            // console.log('is lasSeen < created ', lastSeen.getTime() < postCreated.getTime())
            const tempPost: FeedItemType = {
                id: post.feed_id,
                description: post.feed_description,
                imageUrl: post.feed_images_url.match("\\b\\w*undefined\\w*\\b") ? null : post.feed_images_url,
                author: {
                    id: post.feed_author_id,
                    nickname: post.feed_author_nickname,
                    title: (post.feed_author_team_1 && post.feed_author_team_1 !== null ? post.feed_author_team_1 : '') + (post.feed_author_team_2 && post.feed_author_team_2 !== null ? ', ' + post.feed_author_team_2 : '') + (post.feed_author_team_3 && post.feed_author_team_3 !== null ? ', ' + post.feed_author_team_3 : ''),
                    photo: post.feed_author_photo,
                    mood: post.feed_author_mood
                },
                type: post.feed_type_name,
                commentCount: post.feed_comment_count,
                isNew: lastSeen.getTime() < postCreated.getTime(),
                createdAt: post.feed_created_at,
                updatedAt: post.feed_updated_at,
                isDeleted: (post.feed_is_deleted === 1),
                deletedAt: post.feed_deleted_at,
                thumbnail: post.feed_thumbnail ? (post.feed_thumbnail === "undefined" || post.feed_thumbnail === "" || post.feed_thumbnail.match("\\b\\w*undefined\\w*\\b") ? null : post.feed_thumbnail) : null,
                feedReactions: post.feed_reactions
            }
            tempListFeeds.push(tempPost)
        })

        const sortedListFeed = tempListFeeds.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        this.newNotif = notif
        this.listFeeds = [
            ...this.listFeeds,
            ...(sortedListFeed ?? [])
        ]
        this.isLoading = false
        this.refreshData = true
        // this.listFeeds = sortedListFeed
        console.log('on getListFeedsSuccess, total store list feed ')
        // console.log("list feed: ", this.listFeeds)
    }



    clearListFeed() {
        this.listFeeds = []
        console.log('clear list feed')
        // console.log("list feed: ", this.listFeeds)
    }

    async getListMyFeeds(id: string, page = 1, limit = 5) {
        this.isLoading = true
        try {
            const response = await this.feedApi.getListMyFeed(id, page, limit)

            if (response.kind === "form-error") {
                this.formError(response.response)
            }

            if (response.kind === "ok") {
                this.getListMyFeedsSuccess(response.response.data, response.response.new_notif)
            }
        } catch (e) {
            console.log(e)
            this.setErrorMessage(e)
        } finally {
            console.log("getListMyFeeds done")
            this.isLoading = false
        }
    }

    getListMyFeedsSuccess(data: FeedApiModel[], notif: number) {
        console.log("getListMyFeedsSuccess data",)
        const tempListMyFeeds: FeedItemType[] = []
        const lastSeen = new Date(this.serviceStore.lastSeenFeed)
        // console.log('lastSeen ', lastSeen , lastSeen.getTime())
        data.forEach(post => {
            const postCreated = new Date(post.feed_created_at)
            // console.log('is lasSeen < created ', lastSeen.getTime() < postCreated.getTime())

            tempListMyFeeds.push({
                id: post.feed_id,
                description: post.feed_description,
                imageUrl: post.feed_images_url.match("\\b\\w*undefined\\w*\\b") ? null : post.feed_images_url,
                author: {
                    id: post.feed_author_id,
                    nickname: post.feed_author_nickname,
                    title: '',
                    photo: post.feed_author_photo,
                    mood: post.feed_author_mood
                },
                type: post.feed_type_name,
                commentCount: post.feed_comment_count,
                isNew: lastSeen.getTime() < postCreated.getTime(),
                createdAt: post.feed_created_at,
                updatedAt: post.feed_updated_at,
                isDeleted: (post.feed_is_deleted === 1),
                deletedAt: post.feed_deleted_at,
                thumbnail: post.feed_thumbnail ? (post.feed_thumbnail === "undefined" || post.feed_thumbnail === "" || post.feed_thumbnail.match("\\b\\w*undefined\\w*\\b") ? null : post.feed_thumbnail) : null,
                feedReactions: post.feed_reactions
            })
        })

        const sortedListMyFeed = tempListMyFeeds.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        this.newNotif = notif
        this.listMyFeed = [
            ...this.listMyFeed,
            ...(sortedListMyFeed ?? [])
        ]
        this.isLoading = false
        this.refreshData = true
        // console.log("list my feed: ", this.listMyFeed)
    }


    formReset() {
        this.errorCode = null
        this.errorMessage = null
        this.refreshData = false
    }

    formError(data: ErrorFormResponse) {
        this.errorCode = data.errorCode
        this.errorMessage = data.message
    }

    setErrorMessage(e: any) {
        this.errorMessage = e
    }
}
