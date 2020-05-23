import * as React from 'react';
import queryString from 'query-string';
import { fetchItem } from '../utils/api';
import ItemMeta from './ItemMeta';
import Loading from './Loading';
import CommentTree from './CommentTree';
import { RouteComponentProps } from 'react-router-dom';
import { Helmet } from 'react-helmet';

interface PostPageState {
	post: HNItem;
	loadingPost: boolean;
	error: string;
}

type PostPageProps = RouteComponentProps & {
	location: { state: { item?: HNItem } };
};

/**
 * Creates the listing of a single post including post information and comment
 * tree
 *
 * @class      PostPage
 */
export default class PostPage extends React.Component<
	PostPageProps,
	PostPageState
> {
	state: PostPageState = {
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
					if (post === null) {
						throw { message: 'Post not found.' };
					}
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

	render(): React.ReactNode | React.ReactNode[] {
		const { post, loadingPost, error } = this.state;
		const pageTitle = error
			? error
			: loadingPost === true
			? 'Loading Post'
			: post.title;
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
