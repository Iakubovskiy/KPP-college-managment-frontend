import React, { useEffect, useState } from "react";
import CustomTable, {ActionType} from "../CustomTableComponent/CustomTable";
import {Column} from "../CustomTableComponent/CustomTable";
import {Button} from "@nextui-org/react";
import StudentService from "../../../services/StudentService";
import GroupService from "../../../services/GroupService";
import Link from "next/link";
import {useRouter} from "next/router";
import Student from "../../../models/Student";

interface StudentListProps {
    group_id:number;
    role:string;
}

export default function StudentsList({group_id, role}: StudentListProps) {
    const [students, setStudents] = useState<Student[]>([]);
    const studentService = new StudentService();
    const groupService = new GroupService();
    const router = useRouter();
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await groupService.getGroupStudents(group_id);
                setStudents(data);
            } catch (error) {
                console.error("Помилка при отриманні форм клинків:", error);
            }
        };

        fetchStudents();
    }, []);

    const studentDelete = async (id: number) => {
        alert ("No such possibility");
    };

    const columns: Column<Student>[] = [
        { name: "Ім\'я", uid: "name" },
        { name: "Прізвище", uid: "surname" },
        { name: "Email", uid: "email" },
    ];

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
            <CustomTable data={students} columns={columns} onDelete={studentDelete}/>
        </div>
    );
}
