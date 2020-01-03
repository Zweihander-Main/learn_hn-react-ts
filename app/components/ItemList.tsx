import * as React from 'react';
import ItemListSingle from './ItemListSingle';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from './Loading';

interface ItemListProps extends React.Props<ItemList> {
	items: Array<HNItem>;
}

interface ItemListState {
	hasMore: boolean;
	loadedItems: Array<HNItem>;
}

const itemsToLoad = 50;

export default class ItemList extends React.Component<
	ItemListProps,
	ItemListState
> {
	constructor(props: ItemListProps) {
		super(props);
		const { items } = this.props;

		if (items.length > 0) {
			this.state = {
				hasMore: true,
				loadedItems: items.slice(0, itemsToLoad),
			};
		} else {
			this.state = {
				hasMore: false,
				loadedItems: [],
			};
		}
	}

	addMorePosts = (): void => {
		this.setState(
			(prevState: ItemListState): ItemListState => {
				const { loadedItems } = prevState;
				const { items } = this.props;
				const newLength = loadedItems.length + itemsToLoad;
				const newItems = items.slice(0, newLength);

				return {
					loadedItems: newItems,
					hasMore: items.length > newLength ? true : false,
				};
			}
		);
	};

	render(): JSX.Element {
		const { hasMore, loadedItems } = this.state;

		return (
			<ul>
				{loadedItems?.length > 0 ? (
					<InfiniteScroll
						dataLength={loadedItems.length}
						next={this.addMorePosts}
						hasMore={hasMore}
						loader={<Loading text="Loading more posts" />}
					>
						{loadedItems.map((item: HNItem) => (
							<ItemListSingle key={item.id} item={item} />
						))}
					</InfiniteScroll>
				) : (
					<p className="center-text">No items to display</p>
				)}
			</ul>
		);
	}
}
