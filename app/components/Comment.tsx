import * as React from 'react';
import ItemMeta from './ItemMeta';

interface CommentProps extends React.Props<Comment> {
	comment: HNItem;
	depth: number;
}

export default class Comment extends React.Component<CommentProps> {
	commentStyle = {
		marginLeft: 40 * this.props.depth,
	};

	render(): JSX.Element {
		const { id, by, time, text } = this.props.comment;

		return (
			<div style={this.commentStyle} className="comment">
				<ItemMeta by={by} time={time} id={id} />
				<p
					dangerouslySetInnerHTML={{
						__html: text,
					}}
				/>
			</div>
		);
	}
}
