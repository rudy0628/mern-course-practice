import React, { useState, useContext } from 'react';
import {
	VALIDATOR_EMAIL,
	VALIDATOR_MINLENGTH,
	VALIDATOR_REQUIRE,
} from '../../shared/utils/validators';
import useForm from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-Context';
import useHttpClient from '../../shared/hooks/http-hook';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import './UserAuth.css';

const UserAuth = () => {
	const authCtx = useContext(AuthContext);
	const [isLoginMode, setIsLoginMode] = useState(true);
	const [sendRequest, error, isLoading, clearError] = useHttpClient();

	const [inputHandler, formState, setFormData] = useForm(
		{
			email: {
				value: '',
				isValid: false,
			},
			password: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	const submitHandler = async e => {
		e.preventDefault();

		console.log(formState.inputs);

		if (isLoginMode) {
			try {
				const responseData = await sendRequest(
					`${process.env.REACT_APP_BACKEND_URL}/users/login`,
					'POST',
					JSON.stringify({
						email: formState.inputs.email.value,
						password: formState.inputs.password.value,
					}),
					{
						'Content-Type': 'application/json',
					}
				);

				authCtx.login(responseData.userId, responseData.token);
			} catch (e) {}
		} else {
			try {
				// using formData cause the image is binary type file, not a text file, we are not allow to use json anymore.
				const formData = new FormData();
				formData.append('name', formState.inputs.name.value);
				formData.append('email', formState.inputs.email.value);
				formData.append('password', formState.inputs.password.value);
				formData.append('image', formState.inputs.image.value);

				const responseData = await sendRequest(
					`${process.env.REACT_APP_BACKEND_URL}/users/signup`,
					'POST',
					formData
				);

				authCtx.login(responseData.userId, responseData.token);
			} catch (e) {}
		}
	};

	const switchModeHandler = () => {
		// not in login mode, but this is to be switch, so it ready to be login mode, setFormData set login mode inputs state
		if (!isLoginMode) {
			delete formState.inputs.name;
			delete formState.inputs.image;
			setFormData(
				{ ...formState.inputs },
				formState.inputs.email.isValid && formState.inputs.password.isValid
			);
		} else {
			setFormData(
				{
					...formState.inputs,
					name: {
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
		}
		setIsLoginMode(prevState => !prevState);
	};

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			<Card className="authentication">
				{isLoading && <LoadingSpinner asOverlay />}
				<h2>Login Required</h2>
				<form onSubmit={submitHandler}>
					<hr />
					{!isLoginMode && (
						<Input
							element="input"
							id="name"
							type="text"
							placeholder="Enter you name"
							label="Name"
							validators={[VALIDATOR_REQUIRE()]}
							errorText="Please input valid name"
							onInput={inputHandler}
						/>
					)}
					{!isLoginMode && (
						<ImageUpload
							id="image"
							onInput={inputHandler}
							errorText="Please provided an image!"
							center
						/>
					)}
					<Input
						element="input"
						id="email"
						type="text"
						placeholder="Enter you email"
						label="E-mail"
						validators={[VALIDATOR_EMAIL()]}
						errorText="Please input valid email"
						onInput={inputHandler}
					/>
					<Input
						element="input"
						id="password"
						type="password"
						placeholder="Enter you password"
						label="Password"
						validators={[VALIDATOR_MINLENGTH(8)]}
						errorText="Please input valid password"
						onInput={inputHandler}
					/>
					<Button type="submit" disabled={!formState.isValid}>
						{isLoginMode ? 'LOGIN' : 'SIGNUP'}
					</Button>
				</form>
				<Button inverse onClick={switchModeHandler}>
					SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
				</Button>
			</Card>
		</React.Fragment>
	);
};

export default UserAuth;
