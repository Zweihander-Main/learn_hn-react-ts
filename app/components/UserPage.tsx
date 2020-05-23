import * as React from 'react';
import { fetchUser, fetchPosts } from '../utils/api';
import { RouteComponentProps } from 'react-router-dom';
import queryString from 'query-string';
import { Helmet } from 'react-helmet';
import { formatDate } from '../utils/helpers';
import ItemList from './ItemList';
import Loading from './Loading';

interface UserPageState {
	user: HNUser;
	posts: Array<HNItem>;
	loadingUser: boolean;
	loadingPosts: boolean;
	error: string;
}

/**
 * Creates the listing page for a single user including user info and listing of
 * user submitted posts
 *
 * @class      UserPage (name)
 */
export default class UserPage extends React.Component<
	RouteComponentProps,
	UserPageState
> {
	state: UserPageState = {
		user: null,
		posts: null,
		loadingUser: true,
		loadingPosts: true,
		error: null,
	};

	componentDidMount(): void {
		const { id } = queryString.parse(this.props.location.search);

		fetchUser(id as string)
			.then(
				(user): Promise<Array<HNItem>> => {
					if (user === null) {
						throw { message: 'User not found.' };
					} else {
						this.setState({ user, loadingUser: false });
						return fetchPosts(user.submitted || []);
					}
				}
			)
			.then((posts): void =>
				this.setState({
					posts,
					loadingPosts: false,
				})
			)
			.catch(({ message }: { message: string }): void =>
				this.setState({
					error: message,
					loadingUser: false,
					loadingPosts: false,
				})
			);
	}

	render(): React.ReactNode | React.ReactNode[] {
		const { user, posts, loadingUser, loadingPosts, error } = this.state;
		const pageTitle = error
			? error
			: loadingUser === true
			? 'Loading User'
			: user.id;
		const titleJSX = (
			<Helmet key={`title-${pageTitle}`}>
				<title>{pageTitle}</title>
			</Helmet>
		);

		if (error) {
			return [
				titleJSX,
				<p key={`error-${pageTitle}`} className="center-text error">
					{error}
				</p>,
			];
		}

		return [
			titleJSX,
			<React.Fragment key={`user-${pageTitle}`}>
				{loadingUser === true ? (
					<Loading text="Fetching User" />
				) : (
					<React.Fragment>
						<h1 className="header">{user.id}</h1>
						<div className="meta-info-light">
							<span>
								joined <b>{formatDate(user.created)}</b>
							</span>
							<span>
								has <b>{user.karma.toLocaleString()}</b> karma
							</span>
						</div>
						<p dangerouslySetInnerHTML={{ __html: user.about }} />
					</React.Fragment>
				)}
				{loadingPosts === true ? (
					loadingUser === false && <Loading text="Fetching posts" />
				) : (
					<React.Fragment>
						<h2>Posts</h2>
						<ItemList items={posts} />
					</React.Fragment>
				)}
			</React.Fragment>,
		];
	}
}
