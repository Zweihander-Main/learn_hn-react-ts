import * as React from 'react';
import queryString from 'query-string';
import { fetchItem } from '../utils/api';
import ItemMeta from './ItemMeta';
import Loading from './Loading';
import CommentTree from './CommentTree';
import { RouteComponentProps } from 'react-router-dom';
import Helmet from 'react-helmet';

interface PostPageState {
	post: HNItem;
	loadingPost: boolean;
	error: string;
}

export default class PostPage extends React.Component<
	RouteComponentProps,
	PostPageState
> {
	state = {
		post: null,
		loadingPost: true,
		error: null,
	};

	componentDidMount(): void {
		const item = this.props.location.state?.item;

		if (item) {
			this.setState({ post: item, loadingPost: false });
		} else {
			const { id } = queryString.parse(this.props.location.search);
			const numId = parseInt(id as string, 10);

			fetchItem(numId)
				.then((post): void => {
					this.setState({ post, loadingPost: false });
				})
				.catch(({ message }: { message: string }): void =>
					this.setState({
						error: message,
						loadingPost: false,
					})
				);
		}
	}

	render(): JSX.Element | JSX.Element[] {
		const { post, loadingPost, error } = this.state;
		const pageTitle = loadingPost === true ? 'Loading Post' : post.title;
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
			<React.Fragment key={`post-${pageTitle}`}>
				{loadingPost === true ? (
					<Loading text="Fetching post" />
				) : (
					<React.Fragment>
						<h1 className="header">
							<a className="link" href={post.url}>
								{post.title}
							</a>
						</h1>
						<ItemMeta
							by={post.by}
							time={post.time}
							id={post.id}
							descendants={post.descendants}
						/>
						<p dangerouslySetInnerHTML={{ __html: post.text }} />
						<CommentTree parent={post} />
					</React.Fragment>
				)}
			</React.Fragment>,
		];
	}
}
