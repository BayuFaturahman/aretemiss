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
