import { GeneralApiProblem } from "../api-problem";
import { ErrorFormResponse } from "../profile/profile-api.types";

export interface GetListFeedCategoryResponse {
    message:    string;
    data:       Category[];
    pagination: Pagination;
}

export interface Category {
    id:   string;
    name: string;
}

export interface PostCreateEventResponse {
    message: string;
    data:    Data;
    token:   string;
}

export interface Data {
    id:               string;
    isActive:         boolean;
    name:             string;
    startTime:        Date;
    endTime:          Date;
    timezone:         string;
    implementation:   string;
    location:         string;
    locationDetail:   string;
    posterUrl:        string;
    hashtag:          string;
    description:      string;
    typeId:           string;
    startTimestamp:   Date;
    endTimestamp:     Date;
    userId:           string;
    event_updated_at: Date;
    event_created_at: Date;
}

export interface Pagination {
    total:      number;
    total_page: number;
    page:       number;
}

export type GetListCategoryEventTypes = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: GetListFeedCategoryResponse }  | GeneralApiProblem
export type PostCreateEventyTypes = { kind: "form-error"; response: ErrorFormResponse } | { kind: "ok"; response: PostCreateEventResponse }  | GeneralApiProblem