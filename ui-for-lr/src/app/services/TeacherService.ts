import APIService from "./ApiService";
import Schedule from "../models/Schedule";


class SubjectService {
    private apiService: APIService;
    private readonly resource = "teacher";

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
    }

    async getTeacherSchedule(id: number): Promise<Schedule[]> {
        return this.apiService.getById(this.resource, id);
    }
    async getTeacherScheduleForDay(id: number, day:string): Promise<Schedule[]> {
        return this.apiService.getById(`${this.resource}/${id}`, day);
    }
}

export default SubjectService;