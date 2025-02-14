import React, { useEffect, useState } from "react";
import CustomTable, {ActionType} from "../CustomTableComponent/CustomTable";
import {Column} from "../CustomTableComponent/CustomTable";
import { Button } from "@heroui/react";
import GroupService from "../../../services/GroupService"
import Link from "next/link";
import {useRouter} from "next/router";
import Group from "../../../models/Group";

interface GroupListProps {
    role: string;
}

export default function GroupList({role}: GroupListProps) {
    const [groups, setGroups] = useState<Group[]>([]);
    const groupService = new GroupService();
    const router = useRouter();
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const data = await groupService.getAllGroups();
                setGroups(data);
            } catch (error) {
                console.error("Помилка при отриманні форм клинків:", error);
            }
        };

        fetchGroups();
    }, []);

    const groupDelete = async (id: number) => {
        const deleted = await groupService.deleteGroup(id);
        if (deleted) {
            setGroups((prevData)=> prevData.filter((item) => item.id !== id));
        } else {
            alert(`Cannot delete group with id ${id}`);
        }
    };

    const columns: Column<Group>[] = [
        { name: "Назва", uid: "name" },
    ];

    let actions: ActionType[] = [];
    if(role === "admin") {
        actions = ['edit', 'delete'];
    }

    return (
        <div className="p-4">
            <div className="flex justify-between mb-4">
                <Link href={`${router.pathname}/edit/0`}>
                    <Button color="success" className="text-black">
                        Create
                    </Button>
                </Link>
                <Link href="/admin/dashboard" passHref>
                    <Button color="primary" className="text-black">
                        Back
                    </Button>
                </Link>
            </div>
            <CustomTable data={groups} columns={columns} onDelete={groupDelete} actions={actions} />
        </div>
    );
}