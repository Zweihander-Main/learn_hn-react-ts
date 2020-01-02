import * as React from 'react';
import queryString from 'query-string';
import { fetchItem, fetchComments } from '../utils/api';
import ItemMeta from './ItemMeta';
import Loading from './Loading';
import CommentTree from './CommentTree';
import { RouteComponentProps } from 'react-router-dom';

interface PostPageState {
	post: HNItem;
	loadingPost: boolean;
	error: string;
}

export default class PostPage extends React.Component<
	RouteComponentProps,
	Readonly<PostPageState>
> {
	state = {
		post: null,
		loadingPost: true,
		error: null,
	};

	componentDidMount(): void {
		const { id } = queryString.parse(this.props.location.search);
		const numId = parseInt(id as string, 10);

		fetchItem(numId)
			.then(
				(post): Promise<Array<HNItem>> => {
					this.setState({ post, loadingPost: false });
					return fetchComments(post.kids || []);
				}
			)
			.catch(({ message }: { message: string }): void =>
				this.setState({
					error: message,
					loadingPost: false,
				})
			);
	}

	render(): JSX.Element {
		const { post, loadingPost, error } = this.state;

		if (error) {
			return <p className="center-text error">{error}</p>;
		}

		return (
			<React.Fragment>
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
			</React.Fragment>
		);
	}
}
