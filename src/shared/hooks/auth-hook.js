import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

const useAuth = () => {
	const [token, setToken] = useState();
	const [tokenExpirationDate, setTokenExpirationDate] = useState();
	const [userId, setUserId] = useState(null);

	const login = useCallback((userId, token, expirationDate) => {
		setToken(token);
		setUserId(userId);
		// if user not login before, create a new date, else, set a date in original state
		const tokenExpirationDate =
			expirationDate || new Date(new Date().getTime() + 60 * 60 * 1000);
		setTokenExpirationDate(tokenExpirationDate);

		localStorage.setItem(
			'userData',
			JSON.stringify({
				userId: userId,
				token: token,
				expiration: tokenExpirationDate.toISOString(),
			})
		);
	}, []);

	const logout = useCallback(() => {
		setToken(null);
		setTokenExpirationDate(null);
		setUserId(null);
		localStorage.removeItem('userData');
	}, []);

	useEffect(() => {
		const storedData = JSON.parse(localStorage.getItem('userData'));
		if (
			storedData &&
			storedData.token &&
			new Date(storedData.expiration) > new Date()
		) {
			login(
				storedData.userId,
				storedData.token,
				new Date(storedData.expiration)
			);
		}
	}, [login]);

	useEffect(() => {
		if (token && tokenExpirationDate) {
			const remainingTime =
				tokenExpirationDate.getTime() - new Date().getTime();
			logoutTimer = setTimeout(logout, remainingTime);
		} else {
			clearTimeout(logoutTimer);
		}
	}, [token, logout, tokenExpirationDate]);

	return { token, userId, login, logout };
};

export default useAuth;
