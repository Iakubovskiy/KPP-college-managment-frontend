import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import GroupService from "@/app/services/GroupService";
import AuthService from "@/app/services/AuthService";
import Group from "@/app/models/Group";
import '@/app/globals.css';

const RegistrationPage: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        group_id: 0,
        role: ""
    });
    const router = useRouter();
    const authService = new AuthService();
    const groupService = new GroupService();

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const data = await groupService.getAllGroups();
                setGroups(data);
            } catch (error) {
                console.error("Error fetching groups:", error);
            }
        };
        fetchGroups();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let { name, value } = e.target;

        if (name === "group_id") {
            setFormData({ ...formData, [name]: Number(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authService.register(formData);
        } catch (error) {
            console.error("Registration error:", error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-black">Реєстрація</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Ім'я"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded mb-3 text-black"
                />
                <input
                    type="text"
                    name="surname"
                    placeholder="Прізвище"
                    value={formData.surname}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded mb-3 text-black"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded mb-3 text-black"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded mb-3 text-black"
                />
                <select
                    name="group_id"
                    value={String(formData.group_id)}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded mb-3 text-black"
                >
                    <option value="">Оберіть групу</option>
                    {groups.map((group) => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                </select>

                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded mb-3 text-black"
                >
                    <option value="">Оберіть роль</option>
                    <option value="ROLE_STUDENT">Студент</option>
                    <option value="ROLE_TEACHER">Викладач</option>
                    <option value="ROLE_ADMIN">Адміністратор</option>
                </select>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Зареєструватися
                </button>
            </form>
        </div>
    );
};

export default RegistrationPage;
