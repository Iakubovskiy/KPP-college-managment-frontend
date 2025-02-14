import SubjectList from "@/app/components/listComponents/subjectListComponent/subjectList";
import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import '@/app/globals.css';

const SubjectListPage = () => {
    const [role, setRole] = useState<string>("student");

    useEffect(() => {
        const getRoleFromToken = () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const decoded: { roles?: string[] } = jwtDecode(token);
                    if(decoded.roles?.[0] === "ROLE_ADMIN")
                    setRole("admin");
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
            <SubjectList role={role} />
        </div>
    )
}

export default SubjectListPage;