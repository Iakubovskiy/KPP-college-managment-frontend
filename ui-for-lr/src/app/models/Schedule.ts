import Group from "@/app/models/Group";
import Subject from "@/app/models/Subject";

export default interface Schedule {
    group: Group;
    subject: Subject;
    day: string;
    time: string;
}