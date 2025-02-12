import APIService from "./ApiService";
import Schedule from "../models/Schedule";

interface ScheduleResponse{
    id: number;
    group: string;
    subject: string;
    day: string;
    time: string;
}

class SubjectService {
    private apiService: APIService;
    private readonly resource = "teacher";

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
    }

    async getSchedule(id: number): Promise<ScheduleResponse[]> {
        return this.apiService.getById(this.resource, id);
    }
    async getScheduleForDay(id: number, day:string): Promise<ScheduleResponse[]> {
        return this.apiService.getById(`${this.resource}/${id}`, day);
    }
}

export default SubjectService;