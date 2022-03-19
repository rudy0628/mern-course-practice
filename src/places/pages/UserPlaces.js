import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useHttpClient from '../../shared/hooks/http-hook';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const UserPlaces = props => {
	const userId = useParams().userId;
	const [sendRequest, error, isLoading, clearError] = useHttpClient();
	const [userPlaces, setUserPlaces] = useState([]);

	useEffect(() => {
		const getPlacesByUserId = async () => {
			try {
				const responseData = await sendRequest(
					`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
				);
				setUserPlaces(responseData.places);
			} catch (e) {}
		};

		getPlacesByUserId();
	}, [sendRequest, userId]);

	const placeDeletedHandler = deletedPlaceId => {
		setUserPlaces(prevState =>
			prevState.filter(place => place.id !== deletedPlaceId)
		);
	};

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && (
				<div className="centered">
					<LoadingSpinner asOverlay />
				</div>
			)}
			{!isLoading && userPlaces && (
				<PlaceList items={userPlaces} onDeletePlace={placeDeletedHandler} />
			)}
		</React.Fragment>
	);
};

export default UserPlaces;
