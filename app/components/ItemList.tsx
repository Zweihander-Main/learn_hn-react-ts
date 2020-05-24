import * as React from 'react';
import * as PropTypes from 'prop-types';
import ItemListSingle from './ItemListSingle';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from './Loading';
import { HNItemPT as propTypesHNItem, HNItem } from '../types';

interface ItemListProps {
	items?: Array<HNItem>;
}

interface ItemListReducerState {
	hasMore: boolean;
	loadedItems: Array<HNItem>;
}

const ITEMS_TO_LOAD = 50;

type ItemListReducerActions =
	| { type: '' }
	| { type: 'addMorePosts'; items: Array<HNItem> };

function itemListReducer(
	state: ItemListReducerState,
	action: ItemListReducerActions
): ItemListReducerState {
	switch (action.type) {
		case '': {
			return { ...state };
		}
		case 'addMorePosts': {
			const { loadedItems } = state;
			const { items } = action;
			const newLength = loadedItems.length + ITEMS_TO_LOAD;
			const newItems = items.slice(0, newLength);

			return {
				...state,
				loadedItems: newItems,
				hasMore: items.length > newLength ? true : false,
			};
		}
	}
}

/**
 * Creates list of posts from given array of post data. Will lazy load/infinite
 * scroll data beyond itemsToLoad limit.
 */
const ItemList: React.FC<ItemListProps> = ({ items }: ItemListProps) => {
	const [state, dispatch] = React.useReducer(
		itemListReducer,
		items?.length > 0
			? {
					hasMore: true,
					loadedItems: items.slice(0, ITEMS_TO_LOAD),
			  }
			: {
					hasMore: false,
					loadedItems: [],
			  }
	);

	return (
		<ul>
			{state.loadedItems?.length > 0 ? (
				<InfiniteScroll
					dataLength={state.loadedItems.length}
					next={() => dispatch({ type: 'addMorePosts', items })}
					hasMore={state.hasMore}
					loader={<Loading text="Loading more posts" />}
				>
					{state.loadedItems.map((item: HNItem) => (
						<ItemListSingle key={item.id} item={item} />
					))}
				</InfiniteScroll>
			) : (
				<p className="center-text">No items to display</p>
			)}
		</ul>
	);
};

ItemList.propTypes = {
	items: PropTypes.arrayOf(propTypesHNItem),
};

export default ItemList;
