export interface JoinEventResponse {
    message: string;
    data:    Data;
}

export interface Data {
    join: boolean;
}