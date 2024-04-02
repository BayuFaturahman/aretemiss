export interface GetListUserResponse {
    message: string;
    token:   string;
    data:    UserData[];
    meta:    Meta;
}

export interface UserData {
    id:                          string;
    fullname:                    string;
    nickname:                    string;
    email:                       string;
    phoneNumber:                 string;
    password:                    string;
    team1Id:                     string;
    team2Id:                     string;
    team3Id:                     string;
    status:                      string;
    role:                        string;
    isVerify:                    number;
    forgotPasswordFlag:          number;
    mood:                        string;
    photo:                       string;
    isAllowNotification:         number;
    isAllowReminderNotification: number;
    fcmToken:                    string;
    position:                    null;
    user_created_at:             Date;
    user_updated_at:             Date;
    user_deleted_at:             null;
    user_team_1_id:              string;
}

export interface Meta {
    total_pages: number;
    total_items: number;
}
