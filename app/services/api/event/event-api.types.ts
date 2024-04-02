import { GeneralApiProblem } from "../api-problem";
import { ErrorFormResponse } from "../profile/profile-api.types";
import { GetListCategoryEventResponse } from "./response/get-category";
import { GetEventResponse } from "./response/get-event";
import { GetEventDetailResponse } from "./response/get-event-detail";
import { GetListUserResponse } from "./response/get-list-user";
import { JoinEventResponse } from "./response/join-event";
import { PostCreateEventResponse } from "./response/post-event";

export type GetListCategoryEventTypes = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: GetListCategoryEventResponse }  | GeneralApiProblem
export type PostCreateEventyTypes = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: PostCreateEventResponse }  | GeneralApiProblem
export type GetEventTypes = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: GetEventResponse }  | GeneralApiProblem
export type GetEventDetailTypes = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: GetEventDetailResponse }  | GeneralApiProblem
export type JoinEventTypes = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: JoinEventResponse }  | GeneralApiProblem
export type GetListUserTypes = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: GetListUserResponse }  | GeneralApiProblem