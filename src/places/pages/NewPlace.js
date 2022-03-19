import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
	VALIDATOR_REQUIRE,
	VALIDATOR_MINLENGTH,
} from '../../shared/utils/validators';
import useForm from '../../shared/hooks/form-hook';
import useHttpClient from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-Context';

import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import classes from './PlaceForm.module.css';

const NewPlace = () => {
	const [sendRequest, error, isLoading, clearError] = useHttpClient();
	const authCtx = useContext(AuthContext);
	const history = useHistory();

	const [inputHandler, formState] = useForm(
		{
			title: {
				value: '',
				isValid: false,
			},
			description: {
				value: '',
				isValid: false,
			},
			address: {
				value: '',
				isValid: false,
			},
			image: {
				value: null,
				isValid: false,
			},
		},
		false
	);

	const placeSubmitHandler = async e => {
		e.preventDefault();
		try {
			const formData = new FormData();
			formData.append('title', formState.inputs.title.value);
			formData.append('description', formState.inputs.description.value);
			formData.append('address', formState.inputs.address.value);
			formData.append('image', formState.inputs.image.value);

			await sendRequest(
				`${process.env.REACT_APP_BACKEND_URL}/places`,
				'POST',
				formData,
				{
					Authorization: `Bearer ${authCtx.token}`,
				}
			);

			history.push('/');
		} catch (e) {}
		console.log(formState.inputs); // send to backend
	};

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			<form className={classes['place-form']} onSubmit={placeSubmitHandler}>
				{isLoading && <LoadingSpinner asOverlay />}
				<Input
					element="input"
					id="title"
					type="text"
					placeholder="Enter a title"
					label="Title"
					validators={[VALIDATOR_REQUIRE()]}
					errorText="please enter a valid title."
					onInput={inputHandler}
				/>
				<Input
					element="textarea"
					id="description"
					label="Description"
					validators={[VALIDATOR_MINLENGTH(5)]}
					errorText="please enter a valid description(at least 5 characters)."
					onInput={inputHandler}
				/>
				<Input
					element="input"
					id="address"
					placeholder="Enter a address"
					label="Address"
					validators={[VALIDATOR_REQUIRE()]}
					errorText="please enter a valid address."
					onInput={inputHandler}
				/>
				<ImageUpload
					id="image"
					onInput={inputHandler}
					errorText="Please provided an image!"
				/>
				<Button type="submit" disabled={!formState.isValid}>
					ADD PLACE
				</Button>
			</form>
		</React.Fragment>
	);
};

export default NewPlace;

/* 
Input Change flow
1. if input change(value, isValid), the useEffect will trigger and using the onInput function to pass the current variable(value, isValid)
2. if the variable is passing by Input.js, we manage in a reducer(form reducer), and set a bunch function to updated variable
*/
