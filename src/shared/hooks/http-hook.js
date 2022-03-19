import { useState, useCallback, useRef, useEffect } from 'react';

// purpose to use AbortController is when we send the single http, it can take a few moment to finish, but if operating the UI so fast, it will send the same request, and this will cause error.

const useHttpClient = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();

	const activeHttpRequest = useRef([]);

	const sendRequest = useCallback(
		async (url, method = 'GET', body = null, headers = {}) => {
			setIsLoading(true);
			const httpAbortCtrl = new AbortController();
			activeHttpRequest.current.push(httpAbortCtrl);
			try {
				const response = await fetch(url, {
					method: method,
					body: body,
					headers: headers,
					signal: httpAbortCtrl.signal,
				});

				const responseData = await response.json();

				// when the current send http is done, remove the current controller from activeHttpRequest array
				activeHttpRequest.current = activeHttpRequest.current.filter(
					reqCtrl => reqCtrl !== httpAbortCtrl
				);

				if (!response.ok) {
					throw new Error(responseData.message);
				}

				setIsLoading(false);
				return responseData;
			} catch (e) {
				setError(e.message || 'Something went wrong, please try again!');
				setIsLoading(false);
				throw e;
			}
		},
		[]
	);

	const clearError = () => {
		setError(false);
	};

	useEffect(() => {
		return () => {
			activeHttpRequest.current.forEach(abortCtrl => abortCtrl.abort());
		};
	}, []);

	return [sendRequest, error, isLoading, clearError];
};
export default useHttpClient;
