import * as React from 'react';
import * as PropTypes from 'prop-types';
import { fetchComments } from '../utils/api';
import Loading from './Loading';
import Comment from './Comment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { HNItemPT as propTypesHNItem, HNItem } from '../types';

interface CommentTreeProps {
	parent: HNItem;
	depth?: number;
}

interface CommentTreeReducerState {
	comments: Array<HNItem>;
	loading: boolean;
	hasMore: boolean;
	loadedComments: Array<HNItem>;
	error: string;
	collapsed: boolean;
}

const COMMENTS_TO_LOAD = 5;

type CommentTreeReducerActions =
	| { type: 'fetchCommentsSuccess'; comments: Array<HNItem> }
	| { type: 'fetchCommentsFailure'; error: string }
	| { type: 'addMorePosts' }
	| { type: 'toggleCollapse' };

function commentTreeReducer(
	state: CommentTreeReducerState,
	action: CommentTreeReducerActions
): CommentTreeReducerState {
	switch (action.type) {
		case 'fetchCommentsSuccess': {
			return {
				...state,
				comments: action.comments,
				loading: false,
				loadedComments: action.comments.slice(0, COMMENTS_TO_LOAD),
				hasMore: action.comments.length > 0 ? true : false,
			};
		}
		case 'fetchCommentsFailure': {
			return {
				...state,
				error: action.error,
				loading: false,
				hasMore: false,
			};
		}
		case 'addMorePosts': {
			const {
				loadedComments,
				comments,
				loading,
				error,
				collapsed,
			} = state;
			const newLength = loadedComments.length + COMMENTS_TO_LOAD;
			const newComments = comments.slice(0, newLength);

			return {
				...state,
				loadedComments: newComments,
				hasMore: comments.length > newLength ? true : false,
				comments,
				loading,
				error,
				collapsed,
			};
		}
		case 'toggleCollapse': {
			return {
				...state,
				collapsed: !state.collapsed,
			};
		}
	}
}

/**
 * Takes a parent post and recursively fetches and renders comments of that
 * parent, passing them function to toggle collapsed state
 */
const CommentTree: React.FC<CommentTreeProps> = ({
	parent,
	depth = -1,
}: CommentTreeProps) => {
	const [state, dispatch] = React.useReducer(commentTreeReducer, {
		comments: [],
		loading: true,
		hasMore: false,
		loadedComments: [],
		error: null,
		collapsed: false,
	});

	React.useEffect(() => {
		fetchComments(parent.kids || [])
			.then((comments: Array<HNItem>): void =>
				dispatch({
					type: 'fetchCommentsSuccess',
					comments,
				})
			)
			.catch(({ message }: { message: string }): void =>
				dispatch({
					type: 'fetchCommentsFailure',
					error: message,
				})
			);
	}, [parent]);

	const toggleCollapse = (e: React.MouseEvent<HTMLElement>): void => {
		e.preventDefault();
		dispatch({ type: 'toggleCollapse' });
	};

	if (state.error) {
		return <p className="center-text error">{state.error}</p>;
	}

	return (
		<React.Fragment>
			{state.loading === true ? (
				<Loading text="Loading comment" />
			) : (
				<React.Fragment>
					{depth !== -1 && (
						<Comment
							comment={parent}
							depth={depth}
							toggleCollapse={toggleCollapse}
							collapsed={state.collapsed}
						/>
					)}
					{state.collapsed !== true && (
						<InfiniteScroll
							dataLength={state.loadedComments.length}
							next={() => dispatch({ type: 'addMorePosts' })}
							hasMore={state.hasMore}
							loader={<Loading text="Loading more comments" />}
						>
							{state.loadedComments.map((comment: HNItem) => (
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
};

CommentTree.propTypes = {
	parent: propTypesHNItem.isRequired,
	depth: PropTypes.number,
};

export default CommentTree;
