import React, { useEffect, useState } from "react";
import CustomTable from "../CustomTableComponent/CustomTable";
import {Column, ActionType} from "../CustomTableComponent/CustomTable";
import { Button } from "@nextui-org/react";
import TeacherService from "../../../services/TeacherService";
import GroupService from "../../../services/GroupService";
import Link from "next/link";
import {useRouter} from "next/router";
import Schedule from "@/app/models/Schedule";
import ScheduleService from "@/app/services/ScheduleService";
import Group from "@/app/models/Group";
import Subject from "@/app/models/Subject";

interface ScheduleProps{
    id:number,
    role:string,
    period: string,
    day?: string,
}

interface FormatedData{
    id: number;
    spec: string;
    subject: string;
    day: string;
    time: string;
}

export default function ScheduleComponent({id, role, period, day}: ScheduleProps) {
    const [schedule, setSchedule] = useState<FormatedData[]>([]);
    let dataService: TeacherService|GroupService;
    const scheduleService = new ScheduleService();
    if(period === "day" && !day){
        return ("Incorrect data");
    }
    if (role === "teacher") {
        dataService = new TeacherService();
    }else if(role === "group") {
        dataService = new GroupService();
    }
    const router = useRouter();
    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                if (period === "day" && day) {
                    let data = await dataService.getScheduleForDay(id, day);
                    let formattedData = data.map((item) => ({
                        ...item,
                        spec: "group" in item ? item.group : item.teacher,
                    }));
                    setSchedule(formattedData);
                } else if (period === "week") {
                    let data = await dataService.getSchedule(id);
                    let formattedData = data.map((item) => ({
                        ...item,
                        spec: "group" in item ? item.group : item.teacher,
                    }));
                    setSchedule(formattedData);
                }
            } catch (error) {
                console.error("Помилка при отриманні Кріплень:", error);
            }
        };

        fetchSchedule();
    }, []);

    const scheduleDelete = async (id: number) => {
        const deleted = await scheduleService.deleteSchedule(id);
        if (deleted) {
            setSchedule((prevData)=> prevData.filter((item) => item.id !== id));
        } else {
            alert(`Cannot delete group with id ${id}`);
        }
    };

    let columns: Column<FormatedData>[] = [
        { name: "День", uid: "day" },
        { name: "Предмет", uid: "spec" },
        { name: "Час", uid: "time" }
    ];

    let actions: ActionType[] = [];
    if(role === "admin") {
        actions = ['view', 'edit', 'delete'];
    }else {
        actions = ["view"];
    }

    return (
        <div className="p-4">
            <div className="flex justify-between mb-4">
                <Link href={`${router.pathname}/0`}>
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