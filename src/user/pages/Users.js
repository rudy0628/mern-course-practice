import React, { useEffect, useState } from 'react';
import useHttpClient from '../../shared/hooks/http-hook';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const Users = () => {
	const [sendRequest, error, isLoading, clearError] = useHttpClient();
	const [users, setUsers] = useState([]);

	useEffect(() => {
		try {
			const getUsersData = async () => {
				console.log(process.env.REACT_APP_BACKEND_URL);
				const responseData = await sendRequest(
					`${process.env.REACT_APP_BACKEND_URL}/users`
				);

				setUsers(responseData.users);
			};
			getUsersData();
		} catch (e) {}
	}, [sendRequest]);

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && (
				<div className="center">
					<LoadingSpinner asOverlay />
				</div>
			)}
			{!isLoading && <UsersList items={users} />}
		</React.Fragment>
	);
};

export default Users;
