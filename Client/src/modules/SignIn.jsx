/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignIn = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const saveToken = (token) => {
        localStorage.setItem('user:token', token);
    };

    const handleSignIn = async (e) => {
        e.preventDefault();

        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        const logInned = { email, password };

        try {
            const response = await fetch('http://localhost:8000/api/logIn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(logInned),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();
            console.log(data);

            localStorage.setItem('user:token', data.token);
            localStorage.setItem('user:details', JSON.stringify(data.user));

            saveToken(data.token);

            navigate('/dashboard');
        } catch (error) {
            setError(error.message || 'An error occurred during login');
        }
    };

    return (
        <div className='bg-gray-300 h-screen flex items-center justify-center'>
            <div className="my-10 px-32 border-2 py-32 bg-cyan-200 rounded-md shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSignIn}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            placeholder="Your email"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            placeholder="Your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                    >
                        Sign In
                    </button>
                    <h3 className='text-xl text-green-500 mt-20'>
                        Don't Have an Account? <Link className='btn btn-outline btn-accent' to={'/signUp'}> Sign Up</Link>
                    </h3>
                </form>
            </div>
        </div>
    );
};

export default SignIn;

