import React from 'react';
import { useRouter } from 'next/router';
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Users, BookOpen, Calendar, GraduationCap } from 'lucide-react';

const AdminDashboard = () => {
    const router = useRouter();

    const menuItems = [
        {
            title: 'Групи',
            icon: <Users className="w-6 h-6" />,
            description: 'Управління групами студентів',
            path: '/groups'
        },
        {
            title: 'Предмети',
            icon: <BookOpen className="w-6 h-6" />,
            description: 'Управління навчальними предметами',
            path: '/subject'
        },
        {
            title: 'Розклад',
            icon: <Calendar className="w-6 h-6" />,
            description: 'Управління розкладом занять',
            path: '/schedule'
        },
        {
            title: 'Студенти та викладачі',
            icon: <GraduationCap className="w-6 h-6" />,
            description: 'Управління студентами',
            path: '/register'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold mb-8 text-black">Панель адміністратора</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-black">
                    {menuItems.map((item, index) => (
                        <Card
                            key={index}
                            isPressable
                            onPress={() => router.push(item.path)}
                            className="hover:scale-105 transition-transform"
                        >
                            <CardHeader className="flex gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    {item.icon}
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-lg font-medium">{item.title}</p>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <p className="text-gray-600">{item.description}</p>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;