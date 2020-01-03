import * as React from 'react';
import { fetchComments } from '../utils/api';
import Loading from './Loading';
import Comment from './Comment';

interface CommentTreeProps extends React.Props<CommentTree> {
	parent: HNItem;
	depth: number;
}

interface CommentTreeState {
	comments: Array<HNItem>;
	loading: boolean;
}

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
	};

	componentDidMount(): void {
		const { parent } = this.props;

		fetchComments(parent.kids || []).then((comments: Array<HNItem>): void =>
			this.setState({ comments, loading: false })
		);
	}

	render(): JSX.Element {
		const { comments, loading } = this.state;
		const { parent, depth } = this.props;

		return (
			<React.Fragment>
				{loading === true ? (
					<Loading text="Loading comment" />
				) : (
					<React.Fragment>
						{depth !== -1 && (
							<Comment comment={parent} depth={depth} />
						)}
						{comments.map((comment: HNItem) => (
							<CommentTree
								key={comment.id}
								parent={comment}
								depth={depth + 1}
							/>
						))}
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}
