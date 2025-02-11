import APIService from "./ApiService";
import { CreateGroupDTO, UpdateGroupDTO, GroupResponse, GroupScheduleResponse } from "../dto/group.types";
import Student from "../models/Student";

class GroupService {
    private apiService: APIService;
    private readonly resource = "group";

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
    }

    async getAllGroups(): Promise<GroupResponse[]> {
        return this.apiService.getAll(this.resource);
    }

    async getGroupById(id: number): Promise<GroupResponse> {
        return this.apiService.getById(this.resource, id);
    }

    async getGroupStudents(id: number): Promise<Student[]> {
        return this.apiService.getAll(`${this.resource}-students/${id}`);
    }

    async getGroupSchedule(id: number): Promise<GroupScheduleResponse[]> {
        return this.apiService.getAll(`${this.resource}-schedule/${id}`);
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