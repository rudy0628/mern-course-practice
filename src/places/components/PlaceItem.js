import React, { useState, useContext } from 'react';
import { AuthContext } from '../../shared/context/auth-Context';
import useHttpClient from '../../shared/hooks/http-hook';

import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import classes from './PlaceItem.module.css';

const PlaceItem = props => {
	const authCtx = useContext(AuthContext);
	const [showMap, setShowMap] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [sendRequest, error, isLoading, clearError] = useHttpClient();

	const openMapHandler = () => {
		setShowMap(true);
	};

	const closeMapHandler = () => {
		setShowMap(false);
	};

	const showDeleteWarningHandler = () => setShowConfirmModal(true);
	const cancelDeleteWarningHandler = () => setShowConfirmModal(false);

	const confirmDeleteHandler = async () => {
		setShowConfirmModal(false);
		try {
			await sendRequest(
				`${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
				'DELETE',
				null,
				{
					Authorization: `Bearer ${authCtx.token}`,
				}
			);
			props.onDelete(props.id);
		} catch (e) {}
	};

	return (
		<React.Fragment>
			<Modal
				show={showMap}
				onCancel={closeMapHandler}
				header={props.address}
				contentClass={`${classes['place-item__modal-content']}`}
				footerClass={`${classes['place-item__modal-actions']}`}
				footer={
					<Button type="button" onClick={closeMapHandler}>
						CLOSE
					</Button>
				}
			>
				<div className={classes['map-container']}>
					<Map center={props.coordinates} zoom={16} />
				</div>
			</Modal>
			<Modal
				show={showConfirmModal}
				onCancel={cancelDeleteWarningHandler}
				header="Are you sure?"
				footerClass={`${classes['place-item__modal-actions']}`}
				footer={
					<React.Fragment>
						<Button onClick={cancelDeleteWarningHandler} inverse>
							CANCEL
						</Button>
						<Button onClick={confirmDeleteHandler} danger>
							DELETE
						</Button>
					</React.Fragment>
				}
			>
				<p>
					Do you want to proceed and delete this place? Please note that it
					can't be undone thereafter.
				</p>
			</Modal>
			{error && <ErrorModal error={error} onClear={clearError} />}
			<li className={classes['place-item']}>
				<Card className={classes['place-item__content']}>
					{isLoading && <LoadingSpinner asOverlay />}
					<div className={classes['place-item__image']}>
						<img
							src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
							alt={props.title}
						/>
					</div>
					<div className={classes['place-item__info']}>
						<h2>{props.title}</h2>
						<h3>{props.address}</h3>
						<p>{props.description}</p>
					</div>
					<div className={classes['place-item__actions']}>
						<Button onClick={openMapHandler} inverse>
							VIEW ON MAP
						</Button>
						{authCtx.isLoggedIn && authCtx.userId === props.creatorId && (
							<Button to={`/places/${props.id}`}>EDIT</Button>
						)}
						{authCtx.isLoggedIn && authCtx.userId === props.creatorId && (
							<Button danger onClick={showDeleteWarningHandler}>
								DELETE
							</Button>
						)}
					</div>
				</Card>
			</li>
		</React.Fragment>
	);
};

export default PlaceItem;
