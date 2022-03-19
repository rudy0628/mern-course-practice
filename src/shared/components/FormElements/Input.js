import React, { useReducer, useEffect } from 'react';

import { validate } from '../../utils/validators';
import './Input.css';

const inputReducer = (state, action) => {
	switch (action.type) {
		case 'CHANGE':
			return {
				...state,
				value: action.val,
				isValid: validate(action.val, action.validators),
			};
		case 'TOUCH':
			return {
				...state,
				isTouch: true,
			};
		default:
			return state;
	}
};

const Input = props => {
	const [inputState, dispatch] = useReducer(inputReducer, {
		value: props.initialValue || '',
		isValid: props.initialValid || false,
		isTouch: false,
	});

	const { onInput, id } = props;
	const { value, isValid } = inputState;

	useEffect(() => {
		onInput(id, value, isValid);
	}, [id, value, isValid, onInput]);

	const changeHandler = e => {
		dispatch({
			type: 'CHANGE',
			val: e.target.value,
			validators: props.validators,
		});
	};

	const touchHandler = () => {
		dispatch({
			type: 'TOUCH',
		});
	};

	const element =
		props.element === 'input' ? (
			<input
				id={props.id}
				type={props.type}
				placeholder={props.placeholder}
				onChange={changeHandler}
				onBlur={touchHandler}
				value={inputState.value}
			/>
		) : (
			<textarea
				id={props.id}
				rows={props.rows || 3}
				onChange={changeHandler}
				onBlur={touchHandler}
				value={inputState.value}
			/>
		);

	return (
		<div
			className={`form-control ${
				!inputState.isValid && inputState.isTouch && 'form-control--invalid'
			}`}
		>
			<label htmlFor={props.id}>{props.label}</label>
			{element}
			{!inputState.isValid && inputState.isTouch && <p>{props.errorText}</p>}
		</div>
	);
};

export default Input;

/* 
Different between formReducer, inputReducer manage only exact one Input state, and if its state change, then pass to the formReducer to manage(update) multiple input 
*/
