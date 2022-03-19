import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
	VALIDATOR_REQUIRE,
	VALIDATOR_MINLENGTH,
} from '../../shared/utils/validators';
import useForm from '../../shared/hooks/form-hook';
import useHttpClient from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-Context';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import classes from './PlaceForm.module.css';

const UpdatePlace = props => {
	const placeId = useParams().placeId;
	const [sendRequest, error, isLoading, clearError] = useHttpClient();
	const [identifiedPlace, setIdentifiedPlace] = useState(null);
	const history = useHistory();
	const authCtx = useContext(AuthContext);

	const [inputHandler, formState, setFormData] = useForm(
		{
			title: {
				value: '',
				isValid: false,
			},
			description: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	useEffect(() => {
		const getPlaceById = async () => {
			try {
				const responseData = await sendRequest(
					`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
				);

				setIdentifiedPlace(responseData.place);

				setFormData(
					{
						title: {
							value: responseData.place.title,
							isValid: true,
						},
						description: {
							value: responseData.place.description,
							isValid: true,
						},
					},
					true
				);
			} catch (e) {}
		};

		getPlaceById();
	}, [sendRequest, placeId, setFormData]);

	if (isLoading && !formState.inputs.title.value) {
		return (
			<div className="center">
				<LoadingSpinner asOverlay />
			</div>
		);
	}

	if (!identifiedPlace && !error) {
		return (
			<div className="center">
				<Card>
					<h2>Could not find place!</h2>
				</Card>
			</div>
		);
	}

	const submitHandler = async e => {
		e.preventDefault();

		try {
			await sendRequest(
				`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
				'PATCH',
				JSON.stringify({
					title: formState.inputs.title.value,
					description: formState.inputs.description.value,
				}),
				{
					'Content-Type': 'application/json',
					Authorization: `Bearer ${authCtx.token}`,
				}
			);

			history.push(`/${authCtx.userId}/places`);
		} catch (e) {}

		console.log(formState.inputs);
	};

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{!isLoading && identifiedPlace && (
				<form className={classes['place-form']} onSubmit={submitHandler}>
					<Input
						id="title"
						element="input"
						type="text"
						label="Title"
						validators={[VALIDATOR_REQUIRE()]}
						errorText="Please enter a valid input"
						onInput={inputHandler}
						initialValue={identifiedPlace.title}
						initialValid={true}
					/>
					<Input
						id="description"
						element="textarea"
						label="Description"
						validators={[VALIDATOR_MINLENGTH(5)]}
						errorText="Please enter a valid description(at least 5 characters)"
						onInput={inputHandler}
						initialValue={identifiedPlace.description}
						initialValid={true}
					/>
					<Button type="submit" disabled={!formState.isValid}>
						UPDATE PLACE
					</Button>
				</form>
			)}
		</React.Fragment>
	);
};

export default UpdatePlace;
