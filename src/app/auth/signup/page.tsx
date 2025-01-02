"use client"
import Link from "next/link";
import { useState } from "react";

export default function signup() {
  const [formData, setformData] = useState<any>({
    username: "", email: "", password: "", confirmPassword: "", mobileNumber: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setformData((pre: any) => ({
      ...pre,
      [name]: value
    }))
  }

  const validateInputs = (): boolean => {
    const { username, email, password, confirmpassword, mobileNumber } = formData;
    const newErrors: Record<string, string> = {};

    if (!mobileNumber) {
      newErrors.type = "Mobile number is required";
    }
    if (!username.trim()) {
      newErrors.username = "Name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Email id is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email id is not valid";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      newErrors.password = "password should be 8 digit also upper and lower case ";
    }
    if (!confirmpassword) {
      newErrors.confirmpassword = "Confirm password is required";
    } else if (password !== confirmpassword) {
      newErrors.confirmpassword = "Confirm Password do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;
    const url = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${url}auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
      } else {
        setErrors((prev) => ({ ...prev, email: "Email id is already register" }));
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign up to your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  onChange={handleChange}
                  type="username"
                  required
                  autoComplete="username"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
              <p className="text-red-500 mt-2">{errors.username}</p>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  onChange={handleChange}
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
              <p className="text-red-500 mt-2">{errors.email}</p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="mobileNumber" className="block text-sm/6 font-medium text-gray-900">
                  Mobile Number
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="mobileNumber"
                  onChange={handleChange}
                  required
                  autoComplete="mobileNumber"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
              <p className="text-red-500 mt-2">{errors.mobileNumber}</p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  onChange={handleChange}
                  type="password"
                  required
                  autoComplete="password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
              <p className="text-red-500 mt-2">{errors.password}</p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-900">
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  onChange={handleChange}
                  required
                  autoComplete="confirmPassword"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
              <p className="text-red-500 mt-2">{errors.confirmPassword}</p>
            </div>
            <div>
              <button
                onClick={handleSubmit}
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Already have an account ?{' '}
            <Link href="/auth/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
