import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/helpers';
import ThemeContext from '../contexts/theme';
import { HNItemPT as propTypesHNItem, HNItem } from '../types';

interface ItemMetaProps {
	by: string;
	time: number;
	id: number;
	descendants?: number;
	item?: HNItem;
}

/**
 * Renders meta information for a given post or comment
 *
 * @class      PostMetaInfo
 * @return     {React.ReactNode}
 */
const PostMetaInfo: React.FC<ItemMetaProps> = ({
	by,
	time,
	id,
	descendants,
	item,
}: ItemMetaProps) => {
	const theme = React.useContext(ThemeContext);

	return (
		<div className={`meta-info-${theme}`}>
			<span>
				by <Link to={`/user?id=${by}`}>{by}</Link>
			</span>
			<span>on {formatDate(time)}</span>
			{typeof descendants === 'number' && (
				<span>
					with{' '}
					<Link
						to={{
							pathname: '/post',
							search: `?id=${id}`,
							state: {
								item: item,
							},
						}}
					>
						{descendants}
					</Link>{' '}
					comments [
					<a href={`https://news.ycombinator.com/item?id=${id}`}>
						hn
					</a>
					]
				</span>
			)}
		</div>
	);
};

PostMetaInfo.propTypes = {
	by: PropTypes.string.isRequired,
	time: PropTypes.number.isRequired,
	id: PropTypes.number.isRequired,
	descendants: PropTypes.number,
	item: propTypesHNItem,
};

export default PostMetaInfo;
