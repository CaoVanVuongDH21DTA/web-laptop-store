import React, { useCallback, useState } from 'react';
import GoogleSignIn from '../../components/Buttons/GoogleSignIn';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../store/features/common';
import { loginAPI } from '../../api/authentication';
import { saveToken } from '../../utils/jwt-helper';

const Login = () => {
  const [values, setValues] = useState({
    userName: '',
    password: '',
  });
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setError('');
      dispatch(setLoading(true));
      loginAPI(values)
        .then((res) => {
          if (res?.token) {
            saveToken(res?.token);
            navigate('/');
          } else {
            setError('Something went wrong!');
          }
        })
        .catch((err) => {
          // To-do Check response status
          setError('Invalid Credentials!');
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    },
    [dispatch, navigate, values]
  );

  const handleOnChange = useCallback((e) => {
    e.persist();
    setValues((values) => ({
      ...values,
      [e.target.name]: e.target?.value,
    }));
  }, []);

  return (
    <div className="px-8 w-full max-w-md mx-auto">
      <p className="text-3xl font-bold pb-4 pt-6">Sign In</p>
      <GoogleSignIn />
      <p className="text-gray-500 text-center py-3">OR</p>

      <div className="pt-4">
        <form onSubmit={onSubmit}>
          <input
            type="email"
            name="userName"
            value={values?.userName}
            onChange={handleOnChange}
            placeholder="Email address"
            className="h-12 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
            required
          />
          <input
            type="password"
            name="password"
            value={values?.password}
            onChange={handleOnChange}
            placeholder="Password"
            className="h-12 w-full border border-gray-300 rounded-lg p-3 mt-4 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
            required
            autoComplete="new-password"
          />
          <Link
            className="block text-right text-sm text-gray-600 hover:text-blue-600 underline pt-3 transition"
            to="/forgot-password"
          >
            Forgot Password?
          </Link>
          <button
            className="w-full h-12 rounded-lg bg-gray-900 text-white mt-6 hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Sign In
          </button>
        </form>
      </div>
      {error && <p className="text-base text-red-600 mt-3">{error}</p>}
      <Link
        to="/v1/register"
        className="block text-center text-sm text-gray-600 hover:text-blue-600 underline mt-4 transition"
      >
        Don’t have an account? Sign up
      </Link>
    </div>
  );
};

export default Login;