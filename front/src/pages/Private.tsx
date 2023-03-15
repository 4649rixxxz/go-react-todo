import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router";
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from "recoil";
import { fetchAuthenticatedUser } from "../features/user";
import { AuthAtom } from "../states/auth";
import { isAxiosError } from "axios"

const Private = () => {
	const [auth, setAuth] = useRecoilState(AuthAtom)
	const [loading, setLoading] = useState<boolean>(true)
	const navigate = useNavigate();

  useEffect(() => {
		const init = async () => {
			try {
				const authUser = await fetchAuthenticatedUser()
				const {data} = authUser
				if (!data.user_id) {
					setAuth(null)
					navigate('/login')
				}
			} catch (e: unknown) {
				if (isAxiosError(e)) {
					console.log(e.message)
				}
				setAuth(null)
				navigate('/login')
			} finally {
				setLoading(false)
			}
		}
		init()
	}, []);

	if (loading) {
		return (<div>Loading now.....</div>)
	}
	if (loading && !auth) {
		return <Navigate replace to="/login" />
	}
	
	return <Outlet />
};

export default Private;