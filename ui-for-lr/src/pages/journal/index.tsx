import Journal from "@/app/components/Journal/Journal";
import '@/app/globals.css';
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const JournalPage = () => {
    const [id, setId] = useState<string | null>(null);
    const [role, setRole] = useState<string>("");

    useEffect(() => {
        const getRoleFromToken = () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const decoded: { user_id?: string, roles?: string[] } = jwtDecode(token);
                    setId(decoded.user_id || null);
                    setRole(decoded.roles?.[0] || "Невідома роль");
                }
            } catch (error) {
                console.error("Помилка при розшифруванні токена:", error);
            }
        };

        getRoleFromToken();
    }, []);
    console.log(id);

    return (
        <div>
            {role === 'ROLE_TEACHER' ? (
                <Journal teacherId={Number(id)} />
            ) : role === 'ROLE_STUDENT' ? (
                <Journal studentId={Number(id)} />
            ) : (
                <div>Невідомий користувач</div>
            )}
        </div>
    );
};

export default JournalPage;
