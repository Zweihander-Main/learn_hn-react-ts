import * as React from 'react';
import ItemMeta from './ItemMeta';

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
			<li className="post">
				<a className="link" href={url}>
					{title}
				</a>
				<ItemMeta
					by={by}
					time={time}
					descendants={descendants}
					id={id}
				/>
			</li>
		);
	}
}
