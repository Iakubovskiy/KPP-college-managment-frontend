import { useState } from "react";
import AuthService from "@/app/services/AuthService";
import {Button, Card,CardBody } from "@nextui-org/react";
import {Input} from "@heroui/react";
import '@/app/globals.css';
import {useRouter} from "next/router";
import {jwtDecode} from "jwt-decode";

export function LoginPage() {
    let [formData, setFormData] = useState({ username: "", password: "" });
    let [error, setError] = useState("");
    const authService = new AuthService();
    const router = useRouter();

    let handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    let handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            let response = await authService.login(formData.username, formData.password);
            console.log("Logged in token:", response.token);
            localStorage.setItem("token", response.token);
            const decoded: { roles?: string[] } = jwtDecode(response.token);
            if(decoded.roles?.[0] === 'ROLE_ADMIN') {
                router.push("/admin/dashboard");
            }else if(decoded.roles?.[0] === 'ROLE_STUDENT') {
                router.push("/student/dashboard");
            }else if(decoded.roles?.[0] === 'ROLE_TEACHER') {
                router.push("/teacher/dashboard");
            }
        } catch (err) {
            setError("Authentication failed");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg bg-white">
                <CardBody>
                    <h2 className="text-xl font-bold text-center mb-4 text-black">Login</h2>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input className="text-black" name="username" placeholder="email" value={formData.username} onChange={handleChange} required />
                        <Input className="text-black" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                        <Button type="submit" className="w-full text-black">Login</Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}

export default LoginPage;