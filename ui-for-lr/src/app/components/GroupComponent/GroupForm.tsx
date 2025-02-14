import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import GroupService from '@/app/services/GroupService';
import { Card, CardBody, CardHeader, Input, Button } from "@nextui-org/react";

const GroupForm = () => {
    const router = useRouter();
    const { id } = router.query;
    const groupService = new GroupService();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGroup = async () => {
            if (id && id !== '0') {
                try {
                    const group = await groupService.getGroupById(Number(id));
                    setName(group.name);
                } catch (err) {
                    setError('Помилка при завантаженні групи');
                    console.error(err);
                }
            }
        };

        fetchGroup();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (id === '0') {
                await groupService.createGroup({ name });
            } else {
                await groupService.updateGroup(Number(id), { name });
            }
            router.push('/groups');
        } catch (err) {
            setError('Помилка при збереженні групи');
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
                        <p className="text-xl">{id === '0' ? 'Створення нової групи' : 'Редагування групи'}</p>
                    </div>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Назва групи"
                            placeholder="Введіть назву групи"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        <div className="flex justify-between pt-4">
                            <Button
                                color="default"
                                variant="flat"
                                onPress={() => router.push('/groups')}
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

export default GroupForm;