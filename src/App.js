import React, { useContext, Suspense } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch,
} from 'react-router-dom';
import { AuthContext } from './shared/context/auth-Context';

import Users from './user/pages/Users';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

// lazy loading
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));
const UserAuth = React.lazy(() => import('./user/pages/UserAuth'));

const App = () => {
	const authCtx = useContext(AuthContext);

	let routes;
	if (authCtx.isLoggedIn) {
		routes = (
			<Switch>
				<Route path="/" exact>
					<Users />
				</Route>
				<Route path="/:userId/places">
					<UserPlaces />
				</Route>
				<Route path="/places/new" exact>
					<NewPlace />
				</Route>
				<Route path="/places/:placeId" exact>
					<UpdatePlace />
				</Route>
				<Redirect to="/" />
			</Switch>
		);
	} else {
		routes = (
			<Switch>
				<Route path="/" exact>
					<Users />
				</Route>
				<Route path="/:userId/places">
					<UserPlaces />
				</Route>
				<Route path="/auth" exact>
					<UserAuth />
				</Route>
				<Redirect to="/auth" />
			</Switch>
		);
	}

	return (
		<Router>
			<MainNavigation />
			<main>
				<Suspense
					fallback={
						<div className="center">
							<LoadingSpinner />
						</div>
					}
				>
					{routes}
				</Suspense>
			</main>
		</Router>
	);
};

export default App;
