import React, { createContext } from 'react';
import useAuth from '../hooks/auth-hook';

export const AuthContext = createContext({
	isLoggedIn: false,
	token: null,
	userId: null,
	tokenExpirationDate: null,
	login: () => {},
	logout: () => {},
});

const AuthContextProvider = props => {
	const { token, userId, login, logout } = useAuth();

	const value = {
		isLoggedIn: !!token,
		token: token,
		userId: userId,
		login: login,
		logout: logout,
	};

	return (
		<AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
	);
};

export default AuthContextProvider;
