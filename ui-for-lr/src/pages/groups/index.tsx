import GroupList from "@/app/components/listComponents/groupListComponent/groupList";
import '@/app/globals.css';
import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";


const GroupPage = () => {
    const [role, setRole] = useState<string>("student");

    useEffect(() => {
        const getRoleFromToken = () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const decoded: { roles?: string[] } = jwtDecode(token);
                    setRole(decoded.roles?.[0] || "Невідома роль");
                } else {
                    setRole("student");
                }
            } catch (error) {
                console.error("Помилка при розшифруванні токена:", error);
                setRole("Некоректний токен");
            }
        };

        getRoleFromToken();
    }, []);


    return (
        <div className="bg-gray-50 h-screen">
            <GroupList role={role} />
        </div>
    );
}

export default GroupPage;