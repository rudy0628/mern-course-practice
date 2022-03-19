import React, { useRef, useState, useEffect } from 'react';

import Button from './Button';
import './ImageUpload.css';

const ImageUpload = props => {
	const [file, setFile] = useState();
	const [previewUrl, setPreviewUrl] = useState();
	const [isValid, setIsValid] = useState(false);

	const filePickerRef = useRef();

	// if file is change
	useEffect(() => {
		if (!file) {
			return;
		}

		// using file reader to parse the image file to url and set to image
		const fileReader = new FileReader();
		fileReader.onload = () => {
			setPreviewUrl(fileReader.result);
		};
		fileReader.readAsDataURL(file);
	}, [file]);

	//if image is picked(change)
	const pickedHandler = e => {
		let pickedFile;
		let fileIsValid = isValid;
		if (e.target.files && e.target.files.length === 1) {
			pickedFile = e.target.files[0];
			setFile(pickedFile);
			setIsValid(true);
			fileIsValid = true;
		} else {
			setIsValid(false);
			fileIsValid = false;
		}

		props.onInput(props.id, pickedFile, fileIsValid);
	};

	// trigger input upload action
	const pickImageHandler = () => {
		filePickerRef.current.click();
	};

	return (
		<div className="form-control">
			<input
				id={props.id}
				style={{ display: 'none' }}
				type="file"
				accept=".jpeg,.png,.jpg"
				ref={filePickerRef}
				onChange={pickedHandler}
			/>
			<div className={`image-upload ${props.center && 'center'}`}>
				<div className="image-upload__preview">
					{previewUrl && <img src={previewUrl} alt="Preview" />}
					{!previewUrl && <p>Please pick an image!</p>}
				</div>
				<Button type="button" onClick={pickImageHandler}>
					PICK IMAGE
				</Button>
			</div>
			{!isValid && <p>{props.errorText}</p>}
		</div>
	);
};

export default ImageUpload;
