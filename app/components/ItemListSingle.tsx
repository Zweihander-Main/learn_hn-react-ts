import * as React from 'react';
import { HNItem as propTypesHNItem } from '../globals.PropTypes';
import ItemMeta from './ItemMeta';

interface ItemListSingleProps {
	item: HNItem;
}

const ItemListSingle: React.FC<ItemListSingleProps> = ({
	item,
}: ItemListSingleProps): JSX.Element => {
	const { title, url, by, time, id, descendants } = item;

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
				item={item}
			/>
		</li>
	);
};

ItemListSingle.propTypes = {
	item: propTypesHNItem.isRequired,
};

export default ItemListSingle;
