export interface CreateGradeDTO {
    value: number;
    student_id: number;
    subject_id: number;
    date_and_time?: string;
}

export interface UpdateGradeDTO {
    value: number;
}

export interface GradeResponse {
    id: number;
    value: number;
    date_and_time: string;
    student: Student;
    subject: Subject;
    teacher: Teacher;
}