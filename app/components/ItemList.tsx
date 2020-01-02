import * as React from 'react';
import ItemListSingle from './ItemListSingle';

interface ItemListProps {
	items: Array<HNItem>;
}

export default class ItemList extends React.Component<ItemListProps> {
	constructor(props: ItemListProps) {
		super(props);
	}

	render(): JSX.Element {
		const { items } = this.props;

		return (
			<ul>
				{items?.length > 0 ? (
					items.map((item: HNItem) => {
						return <ItemListSingle key={item.id} item={item} />;
					})
				) : (
					<p className="center-text">No items to display</p>
				)}
			</ul>
		);
	}
}
