import * as React from 'react';
import { fetchComments } from '../utils/api';
import Loading from './Loading';
import Comment from './Comment';
import InfiniteScroll from 'react-infinite-scroll-component';

interface CommentTreeProps extends React.Props<CommentTree> {
	parent: HNItem;
	depth: number;
}

interface CommentTreeState {
	comments: Array<HNItem>;
	loading: boolean;
	hasMore: boolean;
	loadedComments: Array<HNItem>;
	error: string;
}

const commentsToLoad = 5;

export default class CommentTree extends React.Component<
	CommentTreeProps,
	CommentTreeState
> {
	static defaultProps = {
		depth: -1,
	};

	state = {
		comments: [],
		loading: true,
		hasMore: false,
		loadedComments: [],
		error: null,
	};

	componentDidMount(): void {
		const { parent } = this.props;

		fetchComments(parent.kids || [])
			.then((comments: Array<HNItem>): void =>
				this.setState({
					comments,
					loading: false,
					loadedComments: comments.slice(0, commentsToLoad),
					hasMore: comments.length > 0 ? true : false,
				})
			)
			.catch(({ message }: { message: string }): void =>
				this.setState({
					error: message,
					loading: false,
					hasMore: false,
				})
			);
	}

	addMorePosts = (): void => {
		this.setState(
			(prevState: CommentTreeState): CommentTreeState => {
				const { loadedComments, comments, loading, error } = prevState;
				const newLength = loadedComments.length + commentsToLoad;
				const newComments = comments.slice(0, newLength);

				return {
					loadedComments: newComments,
					hasMore: comments.length > newLength ? true : false,
					comments,
					loading,
					error,
				};
			}
		);
	};

	render(): JSX.Element {
		const { loadedComments, loading, hasMore, error } = this.state;
		const { parent, depth } = this.props;

		if (error) {
			return <p className="center-text error">{error}</p>;
		}

		return (
			<React.Fragment>
				{loading === true ? (
					<Loading text="Loading comment" />
				) : (
					<React.Fragment>
						{depth !== -1 && (
							<Comment comment={parent} depth={depth} />
						)}
						<InfiniteScroll
							dataLength={loadedComments.length}
							next={this.addMorePosts}
							hasMore={hasMore}
							loader={<Loading text="Loading more comments" />}
						>
							{loadedComments.map((comment: HNItem) => (
								<CommentTree
									key={comment.id}
									parent={comment}
									depth={depth + 1}
								/>
							))}
						</InfiniteScroll>
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}
