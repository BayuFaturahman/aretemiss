import { createEventForm } from "@screens/event/create-event";
import { Api } from "@services/api"
import { EventApi } from "@services/api/event/event-api";
import { Category } from "@services/api/event/response/get-category";
import { Event } from "@services/api/event/response/get-event";

export default class EventStore {
    api: Api
    eventApi: EventApi
    isLoading: boolean
    listEvent: Event[];
    listCategory: Category[];
    listType: Category[];
    eventData: createEventForm;

    constructor(api: Api) {
        this.api = api
        this.isLoading = false
        this.listEvent = []
        this.listCategory = []
        this.listType = []
        this.eventApi = new EventApi(this.api)
        this.eventData = null
    }

    async getListCategory(type:string) {
        let response = await this.eventApi.getListEventCategory(type)
        let data = response['response']['data']
        if(type == 'category-event'){
            this.listCategory = data
        } else if (type == 'type-event'){
            this.listType = data
        }
        return response
    }

    setEventData(data: createEventForm){
        this.eventData = data
    }

    toggleLoading(){
        this.isLoading = !this.isLoading
    }

    async getEvent() {
        console.warn('getEvent')
        this.toggleLoading()
        let response = await this.eventApi.getEvent()
        let data = response['response']['data']
        this.listEvent = data
        // this.toggleLoading()
    }
}