import * as React from 'react';
import * as PropTypes from 'prop-types';
import { HNItemPT as propTypesHNItem, HNItem } from '../types';
import ItemMeta from './ItemMeta';
import ThemeContext from '../contexts/theme';

interface CommentProps {
	comment: HNItem;
	depth: number;
	toggleCollapse: (e: React.MouseEvent<HTMLElement>) => void;
	collapsed: boolean;
}

/**
 * Renders a single comment including collapse button
 *
 * @class      Comment
 * @return     {React.ReactNode}
 */
const Comment: React.FC<CommentProps> = ({
	comment,
	depth,
	toggleCollapse,
	collapsed,
}: CommentProps) => {
	const { id, by, time, text } = comment;

	const theme = React.useContext(ThemeContext);

	return (
		<div style={{ marginLeft: 40 * depth }} className="comment">
			<a
				className={`toggleCollapse toggle-${theme}`}
				href="#"
				onClick={toggleCollapse}
			>
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
};

Comment.propTypes = {
	comment: propTypesHNItem.isRequired,
	depth: PropTypes.number.isRequired,
	toggleCollapse: PropTypes.func.isRequired,
	collapsed: PropTypes.bool.isRequired,
};

export default Comment;
