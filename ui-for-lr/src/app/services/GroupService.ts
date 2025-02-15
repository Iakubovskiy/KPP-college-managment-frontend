import APIService from "./ApiService";
import { CreateGroupDTO, UpdateGroupDTO, GroupResponse } from "../dto/group.types";
import Student from "../models/Student";
import Schedule from "@/app/models/Schedule";
import Group from "@/app/models/Group";

interface ScheduleResponse{
    id: number;
    teacher: string;
    subject: string;
    _day: string;
    time: string;
}

class GroupService {
    private apiService: APIService;
    private readonly resource = "group";

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
    }

    async getAllGroups(): Promise<Group[]> {
        return this.apiService.getAll(this.resource);
    }

    async getGroupById(id: number): Promise<Group> {
        return this.apiService.getById(this.resource, id);
    }

    async getGroupStudents(id: number): Promise<Student[]> {
        return this.apiService.getAll(`${this.resource}-students/${id}`);
    }

    async getSchedule(id: number): Promise<ScheduleResponse[]> {
        return this.apiService.getAll(`${this.resource}-schedule/${id}`);
    }

    async getScheduleForDay(id: number, day:string): Promise<ScheduleResponse[]> {
        return this.apiService.getAll(`${this.resource}-schedule/${id}/${day}`);
    }

    async createGroup(data: CreateGroupDTO): Promise<GroupResponse> {
        return this.apiService.create(this.resource, data);
    }

    async updateGroup(id: number, data: UpdateGroupDTO): Promise<GroupResponse> {
        return this.apiService.update(this.resource, id, data);
    }

    async deleteGroup(id: number): Promise<boolean> {
        return this.apiService.delete(`${this.resource}`, id);
    }
}

export default GroupService;