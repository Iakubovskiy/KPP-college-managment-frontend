import StudentsList from '@/app/components/listComponents/studentListComponent/studentsList';
import {useRouter} from 'next/router';
import '@/app/globals.css';

const studentsPage = () => {
    const router = useRouter();
    const id = router.query.id;

    return (
        <div className="h-screen">
            <StudentsList group_id={Number(id) || 1} />
        </div>
    );
};

export default studentsPage;
