import APIService from "./ApiService";
import ApiService from "./ApiService";

class AuthService {
    private apiService: APIService;

    constructor(apiService: APIService = new ApiService()) {
        this.apiService = apiService;
    }

    async login(username: string, password: string): Promise<{ token: string }> {
        return this.apiService.create("login_check", { username, password });
    }

    async register(
        role: string,
        email: string,
        password: string,
        name: string,
        surname: string,
        dateOfBirth?: string | null,
        group_id?: number | null
    ): Promise<any> {
        const data: any = { role, email, password, name, surname };
        if (dateOfBirth) data.dateOfBirth = dateOfBirth;
        if (group_id) data.group_id = group_id;

        return this.apiService.create("register", data);
    }
}

export default AuthService;
