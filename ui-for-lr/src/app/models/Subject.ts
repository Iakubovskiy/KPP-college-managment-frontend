import Teacher from "@/app/models/Teacher";

export default interface Subject {
    id: number;
    name: string;
    teacher: Teacher;
    hoursPerWeek: number;
}