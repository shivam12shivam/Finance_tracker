import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUp() {
  const [submittedData, setSubmittedData] = useState(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const formData = {
      ...data,
    };
    setSubmittedData(formData);
    console.log(formData);
    const res = await axios.post(
      "http://localhost:3000/auth/register",
      formData
    );
    console.log("response from backend", res.data.message);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#B7D5D4] py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-md mx-auto p-6 sm:p-8 bg-[#b6d1bc] rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-6 text-center">
            User Registration
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black"
              >
                Email*
              </label>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  maxLength: {
                    value: 50,
                    message: "Email must not exceed 50 characters",
                  },
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black"
              >
                Password*
              </label>
              <input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 5,
                    message: "Password must be at least 5 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Password must not exceed 100 characters",
                  },
                })}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-center  space-x-3 pt-4">
              <button
                type="button"
                onClick={() => reset()}
                className="px-4 py-2 border hover:cursor-pointer border-gray-300 rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 hover:cursor-pointer border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </div>
            <div>
              Already have a acccount:{"  "}
              <button
                onClick={() => {
                  navigate("/");
                }}
                className="text-blue-600 hover:cursor-pointer"
              >
                Login
              </button>{" "}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
