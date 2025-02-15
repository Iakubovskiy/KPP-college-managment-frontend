'use client';
import '@/app/globals.css';
import ScheduleForm from "@/app/components/Schedule/ScheduleForm";
const schedulePage = () =>{
    return (
        <div className="h-screen">
            <ScheduleForm />
        </div>
    );
}

export default schedulePage;