import GroupForm from "@/app/components/GroupComponent/GroupForm";
import GroupList from "@/app/components/listComponents/groupListComponent/groupList";
import '@/app/globals.css';

const GroupPage = () => {
    return (
        <div className="bg-gray-50 h-screen">
            <GroupForm />
        </div>
    );
}

export default GroupPage;