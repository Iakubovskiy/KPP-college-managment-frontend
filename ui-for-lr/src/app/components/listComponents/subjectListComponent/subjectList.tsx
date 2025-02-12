import React, { useEffect, useState } from "react";
import CustomTable, {ActionType} from "../CustomTableComponent/CustomTable";
import {Column} from "../CustomTableComponent/CustomTable";
import { Button } from "@nextui-org/react";
import SubjectService from "../../../services/SubjectService"
import Link from "next/link";
import {useRouter} from "next/router";
import Subject from "@/app/models/Subject";

interface SubjectForTable{
    id: number;
    name: string;
    hoursPerWeek: number;
    teacherName: string;
    actions?: string;
}



export default function SubjectList(role:string) {
    const [subjects, setSubjects] = useState<SubjectForTable[]>([]);
    const subjectService = new SubjectService();
    const router = useRouter();
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const data = await subjectService.getAllSubjects();
                const new_data = data.map((item)=>({
                    ...item,
                    teacherName: item.teacher.name,
                }));
                setSubjects(new_data);
            } catch (error) {
                console.error("Помилка при отриманні Subjects:", error);
            }
        };

        fetchSubjects();
    }, []);

    const subjectDelete = async (id: number) => {
        const deleted = await subjectService.deleteSubject(id);
        if (deleted) {
            setSubjects((prevData)=> prevData.filter((item) => item.id !== id));
        } else {
            alert(`Cannot delete group with id ${id}`);
        }
    };


    const columns: Column<SubjectForTable>[] = [
        { name: "Назва", uid: "name" },
        { name: "Годин на тиждень", uid: "hoursPerWeek" },
        { name: "Викладач", uid: "teacherName" },
    ];

    let actions: ActionType[] = []
    if(role === "admin"){
        actions = ['edit', 'delete'];
    }else {
        actions = ['view'];
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
            <CustomTable data={subjects} columns={columns} onDelete={subjectDelete} actions={actions} />
        </div>
    );
}