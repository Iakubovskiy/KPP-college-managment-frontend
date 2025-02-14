import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardBody, CardHeader, Input, Button, Select, SelectItem } from "@nextui-org/react";
import ScheduleService from '../../services/ScheduleService';
import GroupService from '../../services/GroupService';
import SubjectService from '../../services/SubjectService';
import Group from '../../models/Group';
import Subject from '../../models/Subject';

const DAYS = [
    { label: 'Понеділок', value: 'monday' },
    { label: 'Вівторок', value: 'tuesday' },
    { label: 'Середа', value: 'wednesday' },
    { label: 'Четвер', value: 'thursday' },
    { label: "П'ятниця", value: 'friday' }
];

const TIMES = [
    "08:30", "10:25", "12:20", "14:15", "16:10"
].map(time => ({ label: time, value: time }));

const ScheduleForm = () => {
    const router = useRouter();
    const { id } = router.query;
    const scheduleService = new ScheduleService();
    const groupService = new GroupService();
    const subjectService = new SubjectService();

    const [formData, setFormData] = useState({
        group_id: '',
        subject_id: '',
        day: '',
        time: ''
    });
    const [groups, setGroups] = useState<Group[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [groupsData, subjectsData] = await Promise.all([
                    groupService.getAllGroups(),
                    subjectService.getAllSubjects()
                ]);
                setGroups(groupsData);
                setSubjects(subjectsData);

                if (id && id !== '0') {
                    const schedule = await scheduleService.getScheduleById(Number(id));
                    setFormData({
                        group_id: schedule.group.id.toString(),
                        subject_id: schedule.subject.id.toString(),
                        day: schedule.day,
                        time: schedule.time,
                    });
                }
            } catch (err) {
                setError('Помилка при завантаженні даних');
                console.error(err);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const scheduleData = {
                group_id: Number(formData.group_id),
                subject_id: Number(formData.subject_id),
                day: formData.day,
                time: formData.time
            };

            if (id === '0') {
                await scheduleService.createSchedule(scheduleData);
            } else {
                await scheduleService.updateSchedule(Number(id), scheduleData);
            }
            router.push('/admin/schedule');
        } catch (err) {
            setError('Помилка при збереженні розкладу');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                        <p className="text-xl">
                            {id === '0' ? 'Створення нового розкладу' : 'Редагування розкладу'}
                        </p>
                    </div>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Select
                            label="Група"
                            placeholder="Оберіть групу"
                            value={formData.group_id}
                            onChange={(e) => handleChange('group_id', e.target.value)}
                            isRequired
                        >
                            {groups.map((group) => (
                                <SelectItem key={group.id} value={group.id.toString()}>
                                    {group.name}
                                </SelectItem>
                            ))}
                        </Select>

                        <Select
                            label="Предмет"
                            placeholder="Оберіть предмет"
                            value={formData.subject_id}
                            onChange={(e) => handleChange('subject_id', e.target.value)}
                            isRequired
                        >
                            {subjects.map((subject) => (
                                <SelectItem key={subject.id} value={subject.id.toString()}>
                                    {subject.name} ({subject.teacher.name})
                                </SelectItem>
                            ))}
                        </Select>

                        <Select
                            label="День"
                            placeholder="Оберіть день"
                            value={formData.day}
                            onChange={(e) => handleChange('day', e.target.value)}
                            isRequired
                        >
                            {DAYS.map((day) => (
                                <SelectItem key={day.value} value={day.value}>
                                    {day.label}
                                </SelectItem>
                            ))}
                        </Select>

                        <Select
                            label="Час"
                            placeholder="Оберіть час"
                            value={formData.time}
                            onChange={(e) => handleChange('time', e.target.value)}
                            isRequired
                        >
                            {TIMES.map((time) => (
                                <SelectItem key={time.value} value={time.value}>
                                    {time.label}
                                </SelectItem>
                            ))}
                        </Select>

                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        <div className="flex justify-between pt-4">
                            <Button
                                color="default"
                                variant="flat"
                                onPress={() => router.push('/admin/schedule')}
                            >
                                Скасувати
                            </Button>
                            <Button
                                color="primary"
                                type="submit"
                                isLoading={loading}
                            >
                                {loading ? 'Збереження...' : 'Зберегти'}
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
};

export default ScheduleForm;