'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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
    "08:30", "10:00", "11:50", "13:20", "14:50"
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
                        day: schedule._day,
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

            if (id === '0' || !id) {
                await scheduleService.createSchedule(scheduleData);
            } else {
                await scheduleService.updateSchedule(Number(id), scheduleData);
            }
            router.push('/schedule');
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
        <div className="min-h-screen bg-gray-50 py-8 text-black">
            <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">
                        {id === '0' ? 'Створення нового розкладу' : 'Редагування розкладу'}
                    </h2>
                </div>
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Група</label>
                            <select
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                value={formData.group_id}
                                onChange={(e) => handleChange('group_id', e.target.value)}
                                required
                            >
                                <option value="">Оберіть групу</option>
                                {groups.map((group) => (
                                    <option key={group.id} value={group.id.toString()}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Предмет</label>
                            <select
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                value={formData.subject_id}
                                onChange={(e) => handleChange('subject_id', e.target.value)}
                                required
                            >
                                <option value="">Оберіть предмет</option>
                                {subjects.map((subject) => (
                                    <option key={subject.id} value={subject.id.toString()}>
                                        {subject._name} ({subject.teacher.surname} {subject.teacher.first_name})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">День</label>
                            <select
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                value={formData.day}
                                onChange={(e) => handleChange('day', e.target.value)}
                                required
                            >
                                <option value="">Оберіть день</option>
                                {DAYS.map((day) => (
                                    <option key={day.value} value={day.value}>
                                        {day.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Час</label>
                            <select
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                value={formData.time}
                                onChange={(e) => handleChange('time', e.target.value)}
                                required
                            >
                                <option value="">Оберіть час</option>
                                {TIMES.map((time) => (
                                    <option key={time.value} value={time.value}>
                                        {time.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        <div className="flex justify-between pt-4">
                            <button
                                type="button"
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                onClick={() => router.push('/schedule')}
                            >
                                Скасувати
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                disabled={loading}
                            >
                                {loading ? 'Збереження...' : 'Зберегти'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ScheduleForm;