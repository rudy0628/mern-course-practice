import { useCallback, useReducer } from 'react';

const formReducer = (state, action) => {
	switch (action.type) {
		case 'INPUT_CHANGE':
			let formIsValid = true;
			for (const inputId in state.inputs) {
				if (!state.inputs[inputId]) {
					continue;
				}
				if (action.inputId === inputId) {
					formIsValid = formIsValid && action.isValid;
				} else {
					formIsValid = formIsValid && state.inputs[inputId].isValid;
				}
			}
			return {
				...state,
				inputs: {
					...state.inputs,
					[action.inputId]: { value: action.value, isValid: action.isValid },
				},
				isValid: formIsValid,
			};
		case 'SET_DATA':
			return {
				inputs: action.inputs,
				formIsValid: action.formIsValid,
			};
		default:
			return state;
	}
};

const useForm = (initialInputs, initialFormValidity) => {
	const [formState, dispatch] = useReducer(formReducer, {
		inputs: initialInputs,
		isValid: initialFormValidity,
	});

	// prevent infinite loop
	const inputHandler = useCallback((id, value, isValid) => {
		dispatch({
			type: 'INPUT_CHANGE',
			inputId: id,
			value: value,
			isValid: isValid,
		});
	}, []);

	const setFormData = useCallback((inputsData, formValidity) => {
		dispatch({
			type: 'SET_DATA',
			inputs: inputsData,
			formIsValid: formValidity,
		});
	}, []);

	return [inputHandler, formState, setFormData];
};

export default useForm;
