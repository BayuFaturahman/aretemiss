import {
UPDATE_PROFILE,
UPDATE_PROFILE_SUCCESS,
UPDATE_PROFILE_FAILED,
GET_JOURNAL,
GET_JOURNAL_SUCCESS,
GET_JOURNAL_FAILED,
ACCOUNT,
ACCOUNT_SUCCESS,
ACCOUNT_FAILED,
GET_TEAM_LIST,
GET_TEAM_LIST_SUCCESS,
GET_TEAM_LIST_FAILED,
GET_TEAM_MEMBER,
GET_TEAM_MEMBER_SUCCESS,
GET_TEAM_MEMBER_FAILED,
SET_REQUEST_JOURNAL,
CREATE_JOURNAL,
CREATE_JOURNAL_SUCCESS,
CREATE_JOURNAL_FAILED,
GET_JOURNAL_DETAIL,
GET_JOURNAL_DETAIL_SUCCESS,
GET_JOURNAL_DETAIL_FAILED
} from '../actions/types';

const INITIAL_STATE = {
    updateProfileRequest: null,
    updateProfileResponse: null,
    spinner: false,
    jurnal: [],
    createJurnalRequest: null,
    getJurnalResponse: null,
    createJurnalResponse: null,
    account: null,
    teamMember: [],
    teamList: [],
    requestJournal: null,
    createJournalResponse: null,
    journalDetail: null
};


export default (state, action) => {
    if (typeof state === 'undefined') {
       return INITIAL_STATE
     }
    switch (action.type) {
       case UPDATE_PROFILE:
          return { ...state, updateProfileRequest: action.payload, spinner: true}
       case UPDATE_PROFILE_SUCCESS:
          return { 
             ...state, 
            updateProfileResponse: action.payload, 
            spinner: false,
         }
      case UPDATE_PROFILE_FAILED:
          return { ...state, updateProfileResponse: action.payload, spinner: false}
      case GET_JOURNAL:
         return { ...state, updateProfileRequest: action.payload, spinner: true}
      case GET_JOURNAL_SUCCESS:
         let groupArrays = []
         if(action.payload && action.payload.data && action.payload.data.journal)
         {
            const groups = action.payload.data.journal.reduce((groups, game) => {
            const date = game.journal_created_at.split('T')[0];
               if (!groups[date]) {
               groups[date] = [];
               }
               groups[date].push(game);
               return groups;
            }, {});
            groupArrays = Object.keys(groups).map((date) => {
               return {
               date,
               journals: groups[date]
               };
            });
         }
         return { 
            ...state, 
            getJurnalResponse: action.payload, 
            jurnal: groupArrays,
            spinner: false,
         }
         case GET_JOURNAL_FAILED:
            return { ...state, getJurnalResponse: null, 
               jurnal: [], spinner: false}
      case ACCOUNT:
         return { ...state, spinner: true}
      case ACCOUNT_SUCCESS:
            return { ...state, account: action.payload.data[0], spinner: false}
      case ACCOUNT_FAILED:
            return { 
               ...state, 
               account: null, 
               spinner: false,
            }
      case CREATE_JOURNAL:
            return { ...state, spinner: true}
      case CREATE_JOURNAL_SUCCESS:
            console.log('action.payload', action.payload)
            return { ...state, createJournalResponse: action.payload, spinner: false}
      case CREATE_JOURNAL_FAILED:
            return { 
               ...state, 
               createJournalResponse: null, 
               spinner: false,
            }
      case GET_JOURNAL_DETAIL:
            return { ...state, spinner: true}
      case GET_JOURNAL_DETAIL_SUCCESS:
            return { ...state, journalDetail: action.payload, spinner: false}
      case GET_JOURNAL_DETAIL_FAILED:
            return { 
               ...state, 
               journalDetail: null, 
               spinner: false,
            }
      case GET_TEAM_LIST:
         return { ...state, spinner: true}
      case GET_TEAM_LIST_SUCCESS:
            const mappingTeamList = action.payload.data.map((data) => {
               return {
               ...data,
               label: `${data.name}`,
               value: data.id
               };
            })
            return { ...state, teamList: mappingTeamList, spinner: false}
      case GET_TEAM_LIST_FAILED:
            return { 
               ...state, 
               teamList: [], 
               spinner: false,
            }
      case GET_TEAM_MEMBER:
         return { ...state, spinner: true}
      case GET_TEAM_MEMBER_FAILED:
            return { ...state, teamMember: [], spinner: false}
      case  GET_TEAM_MEMBER_SUCCESS:
            const mappingTeamMember = action.payload.data.map((data) => {
               return {
               ...data,
               label: `${data.nickname}`,
               value: data.id
               };
            })
            const filterTeamMember = mappingTeamMember.data && mappingTeamMember.data.filter((item)=> item.id != state.account.user_id)
            return { 
               ...state, 
               teamMember: mappingTeamMember, 
               spinner: false,
            }
      case SET_REQUEST_JOURNAL:
            return { ...state, requestJournal: action.payload, spinner: false}
      default:
            return state;
      }
   };