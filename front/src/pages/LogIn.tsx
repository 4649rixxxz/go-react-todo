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
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>メアド</label>  
          <input type='text' name='email' defaultValue='' placeholder='メアド'></input>
        </div>
        <div>
          <label>パスワード</label>
          <input type='text' name='password' defaultValue= '' placeholder='パスワード'></input>
        </div>
        <input type="submit" value="ログイン" />
      </form>
    </div>
  );
}

export default Login;