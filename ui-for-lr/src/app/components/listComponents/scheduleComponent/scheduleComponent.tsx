'use client'
import React, { useEffect, useState } from "react";
import CustomTable from "../CustomTableComponent/CustomTable";
import { Column, ActionType } from "../CustomTableComponent/CustomTable";
import { Button } from "@nextui-org/react";
import TeacherService from "../../../services/TeacherService";
import GroupService from "../../../services/GroupService";
import Link from "next/link";
import { useRouter } from "next/router";
import ScheduleService from "@/app/services/ScheduleService";
import StudentService from "@/app/services/StudentService";

interface ScheduleProps {
    id: number;
    role: string;
    period: string;
    day?: string;
    group_id?: number;
}

interface FormatedData {
    id: number;
    spec: string;
    subject: string;
    _day: string;
    time: string;
}

export default function ScheduleComponent({ id, role, period, day, group_id }: ScheduleProps) {
    const [schedule, setSchedule] = useState<FormatedData[]>([]);
    let dataService: TeacherService | GroupService;
    const scheduleService = new ScheduleService();
    const router = useRouter();

    if (period === "day" && !day) {
        return ("Incorrect data");
    }

    if (role === "teacher") {
        dataService = new TeacherService();
    } else if (role === "student") {
        dataService = new GroupService();
    }

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                if (role === "admin") {
                    let data = await scheduleService.getAllSchedules({ day, group_id });
                    let formattedData = data.map((item) => ({
                        ...item,
                        subject: item.subject._name,
                        spec: item.group.name,
                    }));
                    setSchedule(formattedData);
                } else {
                    if (period === "day" && day) {
                        let targetId = id;
                        console.log(role);
                        if(role === 'student'){
                            const studentService = new StudentService();
                            const student = await studentService.getStudentById(id);
                            targetId = student.group.id;
                        }
                        let data = await dataService.getScheduleForDay(targetId, day);
                        let formattedData = data.map((item) => ({
                            ...item,
                            _day: day,
                            spec: "group" in item ? item.group : item.teacher,
                        }));
                        setSchedule(formattedData);
                    } else if (period === "week") {
                        let targetId = id;
                        console.log(role);
                        if(role === 'student'){
                            const studentService = new StudentService();
                            const student = await studentService.getStudentById(id);
                            targetId = student.group.id;
                        }
                        let data = await dataService.getSchedule(targetId, day);
                        console.log(data);
                        let formattedData = data.map((item, index) => ({
                            ...item,
                            _day:item.day,
                            spec: "group" in item ? item.group : item.teacher,
                        }));
                        setSchedule(formattedData);
                    }
                }
            } catch (error) {
                console.error("Помилка при отриманні Кріплень:", error);
            }
        };

        fetchSchedule();
    }, [id, role, period, day, group_id]);

    const scheduleDelete = async (id: number) => {
        const deleted = await scheduleService.deleteSchedule(id);
        if (deleted) {
            setSchedule((prevData) => prevData.filter((item) => item.id !== id));
        } else {
            alert(`Cannot delete group with id ${id}`);
        }
    };

    let columns: Column<FormatedData>[] = [
        { name: "День", uid: "_day" },
        { name: "Група | викладач", uid: "spec" },
        { name: "Предмет", uid: "subject" },
        { name: "Час", uid: "time" }
    ];

    let actions: ActionType[] = [];
    if (role === "admin") {
        actions = ['delete'];
    }

    return (
        <div className="p-4 bg-gray-50 h-screen text-black">
            <div className="flex justify-between mb-4">
                <Link href={`${router.pathname}/create`}>
                    <Button color="success">
                        Create
                    </Button>
                </Link>
                <Link href="/admin/dashboard" passHref>
                    <Button color="primary">
                        Back
                    </Button>
                </Link>
            </div>
            <CustomTable data={schedule} columns={columns} onDelete={scheduleDelete} actions={actions} />
        </div>
    );
}
