import React, { useEffect, useState } from 'react';
import GroupService from '../../services/GroupService';
import SubjectService from '../../services/SubjectService';
import GradesService from '../../services/GradesService';
import StudentService from '../../services/StudentService';
import Group from '@/app/models/Group';
import Subject from '@/app/models/Subject';
import Student from '@/app/models/Student';

interface JournalProps {
    teacherId?: number | null;
    studentId?: number | null;
}

const Journal = ({ teacherId, studentId }: JournalProps) => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [grades, setGrades] = useState<Record<number, number[]>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [editingGrade, setEditingGrade] = useState<{studentId: number, index: number} | null>(null);
    const [newGrade, setNewGrade] = useState('');

    const groupService = new GroupService();
    const subjectService = new SubjectService();
    const gradesService = new GradesService();
    const studentService = new StudentService();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);

                if (teacherId) {
                    const subjectsData = await subjectService.getAllSubjects();
                    const teacherSubjects = subjectsData.filter(subject =>
                        subject.teacher.id === teacherId
                    );
                    setSubjects(teacherSubjects);

                    const groupsData = await groupService.getAllGroups();
                    setGroups(groupsData);
                } else if (studentId) {
                    const studentData = await studentService.getStudentById(studentId);
                    setGroups([studentData.group]);

                    const subjectsData = await subjectService.getAllSubjects();
                    setSubjects(subjectsData);
                }
            } catch (err) {
                setError('Помилка при завантаженні даних');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [teacherId, studentId]);

    useEffect(() => {
        const fetchStudents = async () => {
            if (!selectedGroup) return;

            try {
                setLoading(true);
                const studentsData = await groupService.getGroupStudents(Number(selectedGroup));
                setStudents(studentsData);

                if (selectedSubject) {
                    const gradesPromises = studentsData.map(student =>
                        studentService.getStudentGradesInSubject(
                            student.id,
                            Number(selectedSubject)
                        )
                    );

                    const allGradesResults = await Promise.all(gradesPromises);
                    const gradesObj: Record<number, number[]> = {};
                    studentsData.forEach((student, index) => {
                        gradesObj[student.id] = allGradesResults[index].map(g => g.grade);
                    });

                    setGrades(gradesObj);
                } else {
                    const gradesObj: Record<number, number[]> = {};
                    studentsData.forEach(student => {
                        gradesObj[student.id] = [];
                    });
                    setGrades(gradesObj);
                }
            } catch (err) {
                setError('Помилка при завантаженні студентів');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [selectedGroup, selectedSubject]);

    const handleGradeSubmit = async (studentId: number) => {
        if (!editingGrade || !newGrade) return;

        try {
            setLoading(true);
            await gradesService.createGrade({
                student_id: studentId,
                subject_id: Number(selectedSubject),
                grade: Number(newGrade),
                teacher_id: teacherId!,
            });

            setGrades(prev => ({
                ...prev,
                [studentId]: [...(prev[studentId] || []), Number(newGrade)]
            }));

            setEditingGrade(null);
            setNewGrade('');
        } catch (err) {
            setError('Помилка при збереженні оцінки');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <div className="bg-white rounded-lg shadow text-black">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-semibold">Журнал оцінок</h2>
                </div>

                <div className="p-4">
                    <div className="flex gap-4 mb-6">
                        <div className="w-64">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Предмет
                            </label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={loading}
                            >
                                <option value="">Оберіть предмет</option>
                                {subjects.map((subject) => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject._name || "Без назви"}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="w-64">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Група
                            </label>
                            <select
                                value={selectedGroup}
                                onChange={(e) => setSelectedGroup(e.target.value)}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={loading}
                            >
                                <option value="">Оберіть групу</option>
                                {groups.map((group) => (
                                    <option key={group.id} value={group.id}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {loading && (
                        <div className="text-center py-4">
                            <div className="text-gray-500">Завантаження...</div>
                        </div>
                    )}

                    {selectedGroup && selectedSubject && !loading && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Студент
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Оцінки
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Дії
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {students.map((student) => (
                                    <tr key={student.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {student.surname} {student.first_name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {grades[student.id]?.map((grade, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-gray-100 rounded"
                                                    >
                                                            {grade}
                                                        </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {teacherId && editingGrade?.studentId === student.id ? (
                                                <div className="flex gap-2 items-center">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="100"
                                                        value={newGrade}
                                                        onChange={(e) => setNewGrade(e.target.value)}
                                                        className="w-20 px-2 py-1 border rounded"
                                                    />
                                                    <button
                                                        onClick={() => handleGradeSubmit(student.id)}
                                                        disabled={loading}
                                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                                    >
                                                        OK
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingGrade(null);
                                                            setNewGrade('');
                                                        }}
                                                        className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                teacherId && (
                                                    <button
                                                        onClick={() => setEditingGrade({
                                                            studentId: student.id,
                                                            index: grades[student.id]?.length || 0
                                                        })}
                                                        className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
                                                    >
                                                        Додати оцінку
                                                    </button>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Journal;
