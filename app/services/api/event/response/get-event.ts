
export interface GetEventResponse {
    message:    string;
    data:       Event[];
    token:      string;
    pagination: Pagination;
}

export interface Event {
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
    attendances:      Attendance[];
    isMe:             boolean;
    isJoin:           boolean;
    isUpcoming:       boolean;
    isOngoing:        boolean;
    isFinished:       boolean;
}

export interface Attendance {
    isInvitation: boolean;
}

export interface Pagination {
    total:      number;
    total_page: number;
    page:       number;
}