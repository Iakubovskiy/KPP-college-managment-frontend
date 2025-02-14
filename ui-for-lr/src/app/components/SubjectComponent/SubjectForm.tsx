import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SubjectService from '@/app/services/SubjectService';
import TeacherService from '@/app/services/TeacherService';
import { Card, CardBody, CardHeader, Input, Button, Select, SelectItem } from "@nextui-org/react";
import Teacher from '@/app/models/Teacher';

const SubjectForm = () => {
    const router = useRouter();
    const { id } = router.query;
    const subjectService = new SubjectService();
    const teacherService = new TeacherService();

    const [_name, setName] = useState('');
    const [teacherId, setTeacherId] = useState<Number>(Number(id));
    const [hoursPerWeek, setHoursPerWeek] = useState('');
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const teachersData = await teacherService.getAllTeachers();
                setTeachers(teachersData);
            } catch (err) {
                setError('Помилка при завантаженні списку викладачів');
                console.error(err);
            }
        };

        fetchTeachers();
    }, []);

    useEffect(() => {
        const fetchSubject = async () => {
            if (id && id !== '0') {
                try {
                    const subject = await subjectService.getSubjectById(Number(id));
                    setName(subject._name);
                    setTeacherId(subject.teacher.id);
                    setHoursPerWeek(subject.hours_per_week.toString());
                } catch (err) {
                    setError('Помилка при завантаженні предмету');
                    console.error(err);
                }
            }
        };

        fetchSubject();
    }, [id,teachers]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const subjectData = {
                _name,
                teacher_id: Number(teacherId),
                hours_per_week: Number(hoursPerWeek)
            };

            if (id === '0') {
                await subjectService.createSubject(subjectData);
            } else {
                await subjectService.updateSubject(Number(id), subjectData);
            }
            router.push('/subject');
        } catch (err) {
            setError('Помилка при збереженні предмету');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 text-black">
            <Card className="max-w-md mx-auto">
                <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                        <p className="text-xl">
                            {id === '0' ? 'Створення нового предмету' : 'Редагування предмету'}
                        </p>
                    </div>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Назва предмету"
                            placeholder="Введіть назву предмету"
                            value={_name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <Select
                            label="Викладач"
                            placeholder="Оберіть викладача"
                            value={teacherId.toString()}
                            onChange={(e) => setTeacherId(Number(e.target.value))}
                            required
                        >
                            {teachers.map((teacher) => (
                                <SelectItem
                                    key={teacher.id}
                                    value={teacher.id.toString()}
                                    textValue={`${teacher.surname} ${teacher.first_name}`}
                                    className="text-black">
                                    {teacher.surname} {teacher.first_name}
                                </SelectItem>
                            ))}
                        </Select>

                        <Input
                            type="number"
                            label="Годин на тиждень"
                            placeholder="Введіть кількість годин"
                            value={hoursPerWeek}
                            onChange={(e) => setHoursPerWeek(e.target.value)}
                            required
                            min="1"
                        />

                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        <div className="flex justify-between pt-4">
                            <Button
                                color="default"
                                variant="flat"
                                onPress={() => router.push('/subjects')}
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

export default SubjectForm;