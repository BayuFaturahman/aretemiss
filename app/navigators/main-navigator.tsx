import { AppRoute } from "@navigators/navigation-type"
import {
  coachingJournalMain,
  newJournalEntry,
  fillFeedback,
  quizForm,
  fillFeedbackDetail,
  overviewJournalEntry,
  fillFeedbackCoachee,
  overviewJournalEntryByCoachee,
} from "@screens/coaching-journal"
import {
  commentList,
  feedTimelineMain,
  feedGuideline,
  myFeedList,
  newPost,
  postDetails,
} from "@screens/feed"
import {
  settings,
  myAccount,
  myAccountVerifyOTP,
  changePassword,
  changePhone,
  notification,
} from "@screens/settings"
import { notifications } from "@screens/notification"
import { homepage, moodTeam } from "@screens/homepage"
import { JournalEntryType } from "@screens/coaching-journal/new-journal-entry"
import changeDivision from "@screens/settings/change-division"
import { leaderboards, guidePoints, assessment, juaraAssessment } from "@screens/leaderboard"
import { JLDetail } from "app/store/store.coaching"
import juaraAssessmentQuiz from "@screens/leaderboard/juara-assessment-quiz"
import { FeedItemType } from "@screens/feed/feed.type"

const screens: AppRoute[] = [
  {
    name: "coachingJournalMain",
    component: coachingJournalMain,
  },
  {
    name: "newJournalEntry",
    component: newJournalEntry,
  },
  {
    name: "fillFeedback",
    component: fillFeedback,
  },
  {
    name: "settingsPage",
    component: settings,
  },
  {
    name: "myAccount",
    component: myAccount,
  },
  {
    name: "myAccountVerifyOTP",
    component: myAccountVerifyOTP,
  },
  {
    name: "changePassword",
    component: changePassword,
  },
  {
    name: "changeDivision",
    component: changeDivision,
  },
  {
    name: "changePhone",
    component: changePhone,
  },
  {
    name: "quizForm",
    component: quizForm,
  },
  {
    name: "notificationList",
    component: notifications,
  },
  {
    name: "notificationSettings",
    component: notification,
  },
  {
    name: "homepage",
    component: homepage,
  },
  {
    name: "moodTeam",
    component: moodTeam,
  },
  {
    name: "fillFeedbackDetail",
    component: fillFeedbackDetail,
  },
  {
    name: "overviewJournalEntry",
    component: overviewJournalEntry,
  },
  {
    name: "overviewJournalEntryByCoachee",
    component: overviewJournalEntryByCoachee,
  },
  {
    name: "fillFeedbackCoachee",
    component: fillFeedbackCoachee,
  },
  {
    name: "feedTimelineMain",
    component: feedTimelineMain,
  },
  {
    name: "feedGuideline",
    component: feedGuideline,
  },
  {
    name: "newPost",
    component: newPost,
  },
  {
    name: "commentList",
    component: commentList,
  },
  {
    name: "myFeedList",
    component: myFeedList,
  },
  {
    name: "postDetails",
    component: postDetails,
  },
  {
    name: "leaderboards",
    component: leaderboards,
  },
  {
    name: "guidePoints",
    component: guidePoints,
  },
  {
    name: "assessment",
    component: assessment,
  },
  {
    name: "juaraAssesment",
    component: juaraAssessment,
  },
  {
    name: "juaraAssesmentQuiz",
    component: juaraAssessmentQuiz,
  },
]

export type NavigatorParamList = {
  coachingJournalMain: undefined
  feedTimelineMain: {
    newPost?: boolean
  }
  feedGuideline: {
    savedAgreeTnc: string
  }
  settingsPage: undefined
  myAccount: {
    newEmail?: string
    newNickname?: string
    photo?: string
    isPasswordChange?: boolean
  }
  myAccountVerifyOTP: {
    newEmail: string
    newNickname: string
    photo?: string
  }
  changePhone: undefined
  changePassword: undefined
  changeDivision: undefined
  newJournalEntry: {
    isDetail: boolean
  }
  fillFeedback: {
    isDetail: boolean
    data: JournalEntryType
  }
  quizForm: undefined
  notificationList: undefined
  notificationSettings: undefined
  homepage: undefined
  moodTeam: undefined
  fillFeedbackDetail: undefined
  overviewJournalEntry: {
    journalId: string
    isCoachee: boolean
  }
  overviewJournalEntryByCoachee: {
    title: string
    lessonsLearned: JLDetail[]
    commitments: JLDetail[]
    contents: JLDetail[]
    learnersFullname: []
  }
  fillFeedbackCoachee: {
    isFilled: boolean
    journalId: string
  }
  newPost: undefined
  commentList: undefined
  myFeedList: undefined
  postDetails: {
    data: FeedItemType
    isFromMainFeed: boolean
  }
  leaderboards: undefined
  guidePoints: undefined
  assessment: undefined
  juaraAssesment: undefined
  juaraAssesmentQuiz: undefined
}

export default screens
