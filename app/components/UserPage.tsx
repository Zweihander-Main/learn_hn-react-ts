import * as React from 'react';
import { fetchUser, fetchPosts } from '../utils/api';
import { RouteComponentProps } from 'react-router-dom';
import queryString from 'query-string';
import { formatDate } from '../utils/helpers';
import ItemList from './ItemList';

interface UserPageState {
	user: HNUser;
	posts: Array<HNItem>;
}

export default class UserPage extends React.Component<
	RouteComponentProps,
	Readonly<UserPageState>
> {
	state = {
		user: null,
		posts: null,
	};

	componentDidMount(): void {
		const { id } = queryString.parse(this.props.location.search);

		fetchUser(id as string)
			.then((user) => {
				this.setState({ user });
				return fetchPosts(user.submitted || []);
			})
			.then((posts) =>
				this.setState({
					posts,
				})
			);
	}

	render(): JSX.Element {
		const { user, posts } = this.state;

		return (
			<React.Fragment>
				{user === null ? null : (
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
				{posts === null ? null : (
					<React.Fragment>
						<h2>Posts</h2>
						<ItemList items={posts} />
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}
