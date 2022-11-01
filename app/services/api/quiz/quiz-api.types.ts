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

export type QuizQuestionItem = {

}

export type QuizDetailResponse = {
  "id": string
  "title": string
  "category": string
  "status": string
  "quiz_created_at": string
  "quiz_updated_at": string
  "quiz_deleted_at": null | string
  "questions": [
    {
      "id": "afbe7163-8238-4b4d-b7c3-040d13284995",
      "name": "jawaban 1",
      "options": []
    },
    {
      "id": "bab32f66-f483-436f-9a8d-093a7cbcc41d",
      "name": "jawaban 4",
      "options": []
    },
    {
      "id": "d4026519-6bef-4e72-8955-b0d6f0004265",
      "name": "jawaban 3",
      "options": []
    },
    {
      "id": "e75db5f4-bb2c-4f72-bb23-88854d08dee5",
      "name": "jawaban 2",
      "options": []
    }
  ]
}

export type QuizListResult = { kind: "ok"; response: QuizItemResponse[] }  | GeneralApiProblem
