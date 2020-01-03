import * as React from 'react';
import ItemMeta from './ItemMeta';

interface CommentProps extends React.Props<Comment> {
	comment: HNItem;
	depth: number;
	toggleCollapse: () => void;
	collapsed: boolean;
}

export default class Comment extends React.Component<CommentProps> {
	commentStyle = {
		marginLeft: 40 * this.props.depth,
	};

	render(): JSX.Element {
		const { toggleCollapse, comment, collapsed } = this.props;
		const { id, by, time, text } = comment;

		return (
			<div style={this.commentStyle} className="comment">
				<a className="toggleCollapse" href="#" onClick={toggleCollapse}>
					[{collapsed === true ? '+' : '-'}]
				</a>
				{collapsed !== true && (
					<React.Fragment>
						<ItemMeta by={by} time={time} id={id} />
						<p
							dangerouslySetInnerHTML={{
								__html: text,
							}}
						/>
					</React.Fragment>
				)}
			</div>
		);
	}
}
