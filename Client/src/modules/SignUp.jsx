
import { Link } from 'react-router-dom';

const SignUp = () => {




  const handleRegister = (e) => {
    e.preventDefault();

    const form = e.target;
    const fullName = form.fullName.value;
    const email = form.email.value;
    const password = form.password.value;

    const newUser = {
      fullName,
      email,
      password
    };

    console.log(newUser);

    fetch('http://localhost:8000/api/register', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newUser)
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('Error during signUp:', error);
      }
      );
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-300">
      <div className="bg-cyan-200 p-8 rounded shadow-2xl border-2 w-96">
        <h2 className="text-2xl text-black font-bold mb-6 text-center">Welcome</h2>
        <h2 className="text-2xl text-black font-bold mb-6 text-center">SignUp to get started</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">FullName</label>
            <input
              type="text"
              id="text"
              name="fullName"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Your Name"
            />
          </div>
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
          <div className="flex justify-center">
            <button type="submit" className="btn btn-outline btn-accent">
              SignUp
            </button>
          </div>
          <h3 className="text-xl text-green-500 mt-10">
            Already Have an account??<Link className="btn btn-outline btn-accent" to={'/signIn'}>SignIn</Link>
          </h3>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
