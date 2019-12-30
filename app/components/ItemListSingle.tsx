import * as React from 'react';
import { Link } from 'react-router-dom';
import { ThemeConsumer } from '../contexts/theme';
import { formatDate } from '../utils/helpers';

interface ItemListSingleProps extends React.Props<ItemListSingle> {
	item: HNItem;
}

export default class ItemListSingle extends React.Component<
	ItemListSingleProps
> {
	constructor(props: ItemListSingleProps) {
		super(props);
	}

	render(): JSX.Element {
		const { title, url, by, time, id, descendants } = this.props.item;
		return (
			<ThemeConsumer>
				{({ theme }: AppState): JSX.Element => (
					<li className="post">
						<a className="link" href={url}>
							{title}
						</a>
						<div className={`meta-info-${theme}`}>
							<span>
								by <Link to={`/user?id=${by}`}>{by}</Link>
							</span>
							<span>on {formatDate(time)}</span>
							{typeof descendants === 'number' && (
								<span>
									with{' '}
									<Link to={`/post?id=${id}`}>
										{descendants}
									</Link>{' '}
									comments
								</span>
							)}
						</div>
					</li>
				)}
			</ThemeConsumer>
		);
	}
}
