import * as React from 'react';
import * as PropTypes from 'prop-types';
import { fetchComments } from '../utils/api';
import Loading from './Loading';
import Comment from './Comment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { HNItemPT as propTypesHNItem, HNItem } from '../types';

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
	collapsed: boolean;
}

const commentsToLoad = 5;

/**
 * Takes a parent post and recursively fetches and renders comments of that
 * parent, passing them function to toggle collapsed state
 *
 * @class      CommentTree
 */
export default class CommentTree extends React.Component<
	CommentTreeProps,
	CommentTreeState
> {
	static defaultProps = {
		depth: -1,
	};

	static propTypes = {
		parent: propTypesHNItem.isRequired,
		depth: PropTypes.number.isRequired,
	};

	state: CommentTreeState = {
		comments: [],
		loading: true,
		hasMore: false,
		loadedComments: [],
		error: null,
		collapsed: false,
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
				const {
					loadedComments,
					comments,
					loading,
					error,
					collapsed,
				} = prevState;
				const newLength = loadedComments.length + commentsToLoad;
				const newComments = comments.slice(0, newLength);

				return {
					loadedComments: newComments,
					hasMore: comments.length > newLength ? true : false,
					comments,
					loading,
					error,
					collapsed,
				};
			}
		);
	};

	toggleCollapse = (e: React.MouseEvent<HTMLElement>): void => {
		e.preventDefault();
		this.setState((prevState) => ({
			...prevState,
			collapsed: !prevState.collapsed,
		}));
	};

	render(): React.ReactNode {
		const {
			loadedComments,
			loading,
			hasMore,
			error,
			collapsed,
		} = this.state;
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
							<Comment
								comment={parent}
								depth={depth}
								toggleCollapse={this.toggleCollapse}
								collapsed={collapsed}
							/>
						)}
						{collapsed !== true && (
							<InfiniteScroll
								dataLength={loadedComments.length}
								next={this.addMorePosts}
								hasMore={hasMore}
								loader={
									<Loading text="Loading more comments" />
								}
							>
								{loadedComments.map((comment: HNItem) => (
									<CommentTree
										key={comment.id}
										parent={comment}
										depth={depth + 1}
									/>
								))}
							</InfiniteScroll>
						)}
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}
