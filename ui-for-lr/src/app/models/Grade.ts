import Student from "@/app/models/Student";
import Subject from "@/app/models/Subject";

export default interface Grade {
    student: Student;
    subject: Subject;
    value: number;
}