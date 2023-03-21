import {FormEventHandler, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../features/auth';
import { isAxiosError } from "axios"
import { useRecoilState } from 'recoil';
import { AuthAtom } from "../states/auth";
import { fetchAuthenticatedUser } from "../features/user";

const Login = () => {
  const [auth, setAuth] = useRecoilState(AuthAtom)
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
			try {
				const authUser = await fetchAuthenticatedUser()
				const {data} = authUser
        if (data.user_id) {
          navigate('/home');
        } else {
          setAuth(null)
        }
			} catch (e: unknown) {
				if (isAxiosError(e)) {
					console.log(e.message)
				}
				setAuth(null)
			}
		}
		init()
  }, []);
  // https://qiita.com/nuko-suke/items/1393995fd53ecaeb1cbc
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    // 分割代入の際に変数名を指定している
    const { value: email } = (event.target as any).email;
    const { value: password } = (event.target as any).password;
    try {
      const res = await login({email, password});
      const {data} = res;
      if (data.user_id) {
        setAuth(data.user_id)
        navigate('/home');
      }
    } catch (e: unknown) {
      if (isAxiosError(e)) {
        console.log(e.message)
      }
    }
  }; 

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Log in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input id="email" name="email" type="email" defaultValue='' className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input id="password" name="password" type="password"  defaultValue='' className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
            </div>
            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                ログイン
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </>
  );
}

export default Login;