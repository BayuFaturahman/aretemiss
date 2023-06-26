import { string } from "yup";
import { GeneralApiProblem } from "../api-problem"
import { FeedReactionItemType } from "@screens/feed/feed.type";

export interface ErrorFormResponse {
  errorCode: number
  message: string
}

export interface cultureMeasurementTakers {
  cm_taker_id: string
  cm_taker_status: string
  cm_taker_last_filled: number
  cm_taker_total_section: number
}

export interface cultureMeasurementObjectiveModel {
  cm_objective_id: string
  cm_objective_title: string
  cm_objective_max_answerred: number
  culture_measurement_takers: cultureMeasurementTakers[]
  is_enable: boolean
}

export interface CMPublishDataModel {
  id: string
  title: string
  description: string
  status: string
  startDate: string
  endDate: string
  cm_created_at: string
  cm_updated_at: string
  cm_deleted_at: string
  culture_measurement_objectives: cultureMeasurementObjectiveModel[]
}

export type QuestionnaireModel = {
  item: string
  description: string
  type: string
  point?: number
}

export type CopyWritingModel = {
  id: string
  title: string
  description: string
  type: string
  questionnaire: QuestionnaireModel[]
}



export interface GetListPublishResponse {
  message: string
  data: CMPublishDataModel,
}

export interface ErrorFormResponse {
  errorCode: number
  message: string
}

export type GetListPublishResult = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: GetListPublishResponse } | GeneralApiProblem
