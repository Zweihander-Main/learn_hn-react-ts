import * as React from 'react';
import queryString from 'query-string';
import { fetchItem } from '../utils/api';
import ItemMeta from './ItemMeta';
import Loading from './Loading';
import CommentTree from './CommentTree';
import { RouteComponentProps } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { HNItem } from '../types';

interface PostPageReducerState {
	post: HNItem;
	loadingPost: boolean;
	error: string;
}

type PostPageProps = RouteComponentProps & {
	location: { state: { item?: HNItem } };
};

type PostPageReducerActions =
	| { type: 'setFromProp'; post: HNItem }
	| { type: 'success'; post: HNItem }
	| { type: 'error'; message: string };

function postPageReducer(
	state: PostPageReducerState,
	action: PostPageReducerActions
): PostPageReducerState {
	switch (action.type) {
		case 'setFromProp': {
			return {
				...state,
				post: action.post,
				loadingPost: false,
			};
		}
		case 'success': {
			return {
				...state,
				post: action.post,
				loadingPost: false,
			};
		}
		case 'error': {
			return {
				...state,
				error: action.message,
				loadingPost: false,
			};
		}
	}
}

/**
 * Creates the listing of a single post including post information and comment
 * tree
 */
const PostPage: React.FC<PostPageProps> = ({ location }: PostPageProps) => {
	const [state, dispatch] = React.useReducer(postPageReducer, {
		post: null,
		loadingPost: true,
		error: null,
	});

	React.useEffect(() => {
		const item = location.state?.item;

		if (item) {
			dispatch({ type: 'setFromProp', post: item });
		} else {
			const { id } = queryString.parse(location.search);
			const numId = parseInt(id as string, 10);

			fetchItem(numId)
				.then((post): void => {
					if (post === null) {
						throw { message: 'Post not found.' };
					}
					dispatch({ type: 'success', post });
				})
				.catch(({ message }: { message: string }): void =>
					dispatch({ type: 'error', message })
				);
		}
	}, [location]);

	const pageTitle = state.error
		? state.error
		: state.loadingPost === true
		? 'Loading Post'
		: state.post.title;

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
			<React.Fragment key={`post-${pageTitle}`}>
				{state.loadingPost === true ? (
					<Loading text="Fetching post" />
				) : (
					<React.Fragment>
						<h1 className="header">
							<a className="link" href={state.post.url}>
								{state.post.title}
							</a>
						</h1>
						<ItemMeta
							by={state.post.by}
							time={state.post.time}
							id={state.post.id}
							descendants={state.post.descendants}
						/>
						<p
							dangerouslySetInnerHTML={{
								__html: state.post.text,
							}}
						/>
						<CommentTree parent={state.post} />
					</React.Fragment>
				)}
			</React.Fragment>
		</React.Fragment>
	);
};
export default PostPage;
