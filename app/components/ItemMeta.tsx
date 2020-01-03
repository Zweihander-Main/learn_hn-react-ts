import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/helpers';
import { ThemeConsumer } from '../contexts/theme';

interface ItemMetaProps {
	by: string;
	time: number;
	id: number;
	descendants?: number;
	item?: HNItem;
}

const PostMetaInfo: React.FC<ItemMetaProps> = ({
	by,
	time,
	id,
	descendants,
	item,
}: ItemMetaProps): JSX.Element => {
	return (
		<ThemeConsumer>
			{({ theme }: AppState): JSX.Element => (
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
							<a
								href={`https://news.ycombinator.com/item?id=${id}`}
							>
								hn
							</a>
							]
						</span>
					)}
				</div>
			)}
		</ThemeConsumer>
	);
};

export default PostMetaInfo;
