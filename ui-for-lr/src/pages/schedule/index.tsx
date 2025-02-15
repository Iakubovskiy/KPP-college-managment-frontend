"use client";
import '@/app/globals.css';
import ScheduleComponent from "@/app/components/listComponents/scheduleComponent/scheduleComponent";
import { useState, useEffect } from "react";

const SchedulePage = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
    if (!token) return <p>Необхідна авторизація</p>;

    const parseJwt = (token: string) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    const tokenData = parseJwt(token);
    const userId = tokenData?.user_id;
    const role = tokenData?.roles.includes('ROLE_ADMIN')
        ? 'admin'
        : tokenData?.roles.includes('ROLE_TEACHER')
            ? 'teacher'
            : 'student';

    const [selectedDay, setSelectedDay] = useState<string | undefined>(undefined);
    const [selectedGroup, setSelectedGroup] = useState<string | undefined>(undefined);

    const [groups, setGroups] = useState<string[]>([]);
    const [days, setDays] = useState<string[]>(["Monday", "Вівторок", "Середа", "Четвер", "П'ятниця"]);

    useEffect(() => {
        if (role === 'admin') {
            setGroups(["Група 1", "Група 2", "Група 3"]);
        }
    }, [role]);

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
                                <option key={group} value={group}>
                                    {group}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            <ScheduleComponent
                id={userId}
                role={role}
                period="week"
                day={selectedDay}
                group_id={Number(selectedGroup)}
            />
        </div>
    );
};

export default SchedulePage;
