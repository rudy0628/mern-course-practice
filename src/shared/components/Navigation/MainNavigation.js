import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

import NavLinks from './NavLinks';
import MainHeader from './MainHeader';
import SideDrawer from './SideDrawer';
import Backdrop from '../../components/UIElements/Backdrop';
import classes from './MainNavigation.module.css';

const MainNavigation = props => {
	const [drawerIsOpen, setDrawerIsOpen] = useState(false);

	const drawerOpenHandler = () => {
		setDrawerIsOpen(true);
	};

	const drawerCloseHandler = () => {
		setDrawerIsOpen(false);
	};

	return (
		<Fragment>
			{drawerIsOpen && <Backdrop onClick={drawerCloseHandler} />}
			<SideDrawer show={drawerIsOpen} onClick={drawerCloseHandler}>
				<nav className={classes['main-navigation__drawer-nav']}>
					<NavLinks />
				</nav>
			</SideDrawer>
			<MainHeader>
				<button
					onClick={drawerOpenHandler}
					className={classes['main-navigation__menu-btn']}
				>
					<span></span>
					<span></span>
					<span></span>
				</button>
				<h1 className={classes['main-navigation__title']}>
					<Link to="/">YourPlaces</Link>
				</h1>
				<nav className={classes['main-navigation__header-nav']}>
					<NavLinks />
				</nav>
			</MainHeader>
		</Fragment>
	);
};

export default MainNavigation;
