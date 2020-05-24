import * as React from 'react';
import { fetchUser, fetchPosts } from '../utils/api';
import { RouteComponentProps } from 'react-router-dom';
import queryString from 'query-string';
import { Helmet } from 'react-helmet';
import { formatDate } from '../utils/helpers';
import ItemList from './ItemList';
import Loading from './Loading';
import { HNItem, HNUser } from '../types';

interface UserPageReducerState {
	user: HNUser;
	posts: Array<HNItem>;
	loadingUser: boolean;
	loadingPosts: boolean;
	error: string;
}

type UserPageReducerActions =
	| { type: 'successUser'; user: HNUser }
	| { type: 'successPosts'; posts: Array<HNItem> }
	| { type: 'error'; message: string };

function userPageReducer(
	state: UserPageReducerState,
	action: UserPageReducerActions
): UserPageReducerState {
	switch (action.type) {
		case 'successUser': {
			return { ...state, user: action.user, loadingUser: false };
		}
		case 'successPosts': {
			return { ...state, posts: action.posts, loadingPosts: false };
		}
		case 'error': {
			return {
				...state,
				error: action.message,
				loadingPosts: false,
				loadingUser: false,
			};
		}
	}
}

/**
 * Creates the listing page for a single user including user info and listing of
 * user submitted posts
 */
const UserPage: React.FC<RouteComponentProps> = ({
	location,
}: RouteComponentProps) => {
	const [state, dispatch] = React.useReducer(userPageReducer, {
		user: null,
		posts: null,
		loadingUser: true,
		loadingPosts: true,
		error: null,
	});

	React.useEffect(() => {
		const { id } = queryString.parse(location.search);

		fetchUser(id as string)
			.then(
				(user): Promise<Array<HNItem>> => {
					if (user === null) {
						throw { message: 'User not found.' };
					} else {
						dispatch({ type: 'successUser', user });
						return fetchPosts(user.submitted || []);
					}
				}
			)
			.then((posts): void => dispatch({ type: 'successPosts', posts }))
			.catch(({ message }: { message: string }): void =>
				dispatch({ type: 'error', message })
			);
	}, [location]);

	const pageTitle = state.error
		? state.error
		: state.loadingUser === true
		? 'Loading User'
		: state.user.id;
	const titleJSX = (
		<Helmet key={`title-${pageTitle}`}>
			<title>{pageTitle}</title>
		</Helmet>
	);

	if (state.error) {
		return (
			<React.Fragment>
				{titleJSX}
				<p key={`error-${pageTitle}`} className="center-text error">
					{state.error}
				</p>
			</React.Fragment>
		);
	}

	return (
		<React.Fragment>
			{titleJSX}
			<React.Fragment key={`user-${pageTitle}`}>
				{state.loadingUser === true ? (
					<Loading text="Fetching User" />
				) : (
					<React.Fragment>
						<h1 className="header">{state.user.id}</h1>
						<div className="meta-info-light">
							<span>
								joined <b>{formatDate(state.user.created)}</b>
							</span>
							<span>
								has <b>{state.user.karma.toLocaleString()}</b>{' '}
								karma
							</span>
						</div>
						<p
							dangerouslySetInnerHTML={{
								__html: state.user.about,
							}}
						/>
					</React.Fragment>
				)}
				{state.loadingPosts === true ? (
					state.loadingUser === false && (
						<Loading text="Fetching posts" />
					)
				) : (
					<React.Fragment>
						<h2>Posts</h2>
						<ItemList items={state.posts} />
					</React.Fragment>
				)}
			</React.Fragment>
		</React.Fragment>
	);
};

export default UserPage;
