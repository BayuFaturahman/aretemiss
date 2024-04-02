export interface GetEventDetailResponse {
    message: string;
    data:    IEventDetail;
    token:   string;
}

export interface IEventDetail {
    id:               string;
    name:             string;
    startTime:        Date;
    endTime:          Date;
    startTimestamp:   Date;
    endTimestamp:     Date;
    timezone:         string;
    implementation:   string;
    location:         string;
    locationDetail:   string;
    posterUrl:        string;
    hashtag:          string;
    description:      string;
    typeId:           string;
    userId:           string;
    isActive:         boolean;
    event_created_at: Date;
    event_updated_at: Date;
    event_deleted_at: null;
    categories:       Type[];
    type:             Type;
    attendances:      Attendance[];
    user:             User;
    reactions:        Reaction[];
    categoryIds:      string[];
    isMe:             boolean;
    isJoin:           boolean;
    isUpcoming:       boolean;
    isOngoing:        boolean;
    isFinished:       boolean;
}

export interface Attendance {
    isInvitation: boolean;
    user:         User;
}

export interface User {
    fullname: string;
    nickname: string;
    id:       string;
    photo:    string;
}

export interface Type {
    name: string;
}

export interface Reaction {
    reaction: string;
    userId:   string;
}
