"use client"


export default function Home() {
    const handleOnClick = () =>{
        fetch('https://localhost/api/login_check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'user@example.com',
                password: '123',
            }),
        })
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((err) => console.error('Error:', err));

    };
    return (
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <button onClick={handleOnClick}>
                dfdsfewwefew
            </button>
        </div>
    );

}
