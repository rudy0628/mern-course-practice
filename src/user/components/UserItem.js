import React from 'react';
import { Link } from 'react-router-dom';

import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';
import classes from './UserItem.module.css';

const UserItem = props => {
	return (
		<li className={classes['user-item']}>
			<Card className={classes['user-item__content']}>
				<Link to={`/${props.id}/places`}>
					<div className={classes['user-item__image']}>
						<Avatar
							image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
							alt={props.name}
						/>
					</div>
					<div className={classes['user-item__info']}>
						<h2>{props.name}</h2>
						<h3>
							{props.placeCount} {props.placeCount === 1 ? 'Place' : 'Places'}
						</h3>
					</div>
				</Link>
			</Card>
		</li>
	);
};

export default UserItem;
