"use client";
import '@/app/globals.css';
import ScheduleComponent from "@/app/components/listComponents/scheduleComponent/scheduleComponent";
import { useState, useEffect, useMemo } from "react";
import GroupService from "@/app/services/GroupService";

const SchedulePage = () => {
    const [token, setToken] = useState<string | null>(null);
    const [tokenData, setTokenData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const groupService = new GroupService();

    const parseJwt = (token: string) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
        if (storedToken) {
            setTokenData(parseJwt(storedToken));
        }
        setIsLoading(false);
    }, []);

    const role = useMemo(() => {
        if (!tokenData || !tokenData.roles) return 'student';
        return tokenData.roles.includes('ROLE_ADMIN')
            ? 'admin'
            : tokenData.roles.includes('ROLE_TEACHER')
                ? 'teacher'
                : 'student';
    }, [tokenData]);

    let Id = tokenData?.user_id;

    const [selectedDay, setSelectedDay] = useState<string | undefined>(undefined);
    const [selectedGroup, setSelectedGroup] = useState<string | undefined>(undefined);
    const [groups, setGroups] = useState<{ id: number; name: string }[]>([]);
    const [days] = useState<string[]>(["monday", "tuesday", "wednesday", "thursday", "friday"]);

    useEffect(() => {
        if (role === 'admin') {
            groupService.getAllGroups()
                .then((response) => {
                    setGroups(response);
                })
                .catch((error) => {
                    console.error("Помилка при завантаженні груп:", error);
                });
        }else if(role === 'student'){

        }
    }, [role]);

    if (isLoading) return <p>Завантаження...</p>;
    if (!token) return <p>Необхідна авторизація</p>;

    return (
        <div className="h-screen">
            <div className="flex justify-between p-4 bg-gray-100">
                <div className="flex">
                    <select
                        className="p-2 border"
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                    >
                        <option value="">Виберіть день</option>
                        {days.map((day) => (
                            <option key={day} value={day}>
                                {day}
                            </option>
                        ))}
                    </select>
                    {role === "admin" && (
                        <select
                            className="p-2 border ml-4"
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                        >
                            <option value="">Виберіть групу</option>
                            {groups.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            <ScheduleComponent
                id={Id}
                role={role}
                period="week"
                day={selectedDay}
                group_id={selectedGroup ? Number(selectedGroup) : undefined}
            />
        </div>
    );
};

export default SchedulePage;