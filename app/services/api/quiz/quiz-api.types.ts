import { GeneralApiProblem } from "../api-problem"

export type QuizItemResponse = {
  "quiz_id": string
  "quiz_title": string
  "quiz_category": string
  "quiz_status": string
  "quiz_created_at": string
  "quiz_updated_at": string
  "quiz_deleted_at": string
  "qtaker_id": string
  "qtaker_quiz_id": string
  "qtaker_user_id": string
  "qtaker_point": string
  "qtaker_created_at": string
  "qtaker_updated_at": string
  "qtaker_deleted_at": string
  "total_question": number
}

export type QuizQuestionOptionsPair = {
  "id": string
  "name": string
}

export type QuizDetailResponse = {
  "id": string
  "title": string
  "category": string
  "status": string
  "quiz_created_at": string
  "quiz_updated_at": string
  "quiz_deleted_at": null | string
  "questions": Array<QuizQuestionOptionsPair & {options: QuizQuestionOptionsPair[]}>
}

export type QuizListResult = { kind: "ok"; response: QuizItemResponse[] }  | GeneralApiProblem
export type QuizDetailResult = { kind: "ok"; response: QuizDetailResponse }  | GeneralApiProblem
export type PostAnswerResult = { kind: "ok"; response: {point: number} }  | GeneralApiProblem
