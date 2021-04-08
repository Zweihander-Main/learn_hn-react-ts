import * as React from 'react';
import ItemList from './ItemList';
import Loading from './Loading';
import { fetchMainPosts } from '../utils/api';
import { Helmet } from 'react-helmet';
import { HNTypesPT as propTypesHNTypes, HNItem, HNTypes } from '../types';

interface ItemsPageProps {
	type: HNTypes;
}

interface ItemsPageReducerState {
	items: Array<HNItem>;
	error: string;
	loading: boolean;
}

type ItemsPageReducerActions =
	| { type: 'reset' }
	| { type: 'success'; items: Array<HNItem> }
	| { type: 'error'; message: string };

function itemsPageReducer(
	state: ItemsPageReducerState,
	action: ItemsPageReducerActions
): ItemsPageReducerState {
	switch (action.type) {
		case 'reset': {
			return { items: null, error: null, loading: true };
		}
		case 'success': {
			return { items: action.items, error: null, loading: false };
		}
		case 'error': {
			return { ...state, loading: false, error: action.message };
		}
	}
}

/**
 * Fetches a list of posts for the given post type and renders a page listing
 * those posts
 */
const ItemsPage: React.FC<ItemsPageProps> = ({ type }: ItemsPageProps) => {
	const [state, dispatch] = React.useReducer(itemsPageReducer, {
		items: null,
		error: null,
		loading: true,
	});

	React.useEffect(() => {
		dispatch({ type: 'reset' });
		fetchMainPosts(type)
			.then((items: Array<HNItem>): void => {
				dispatch({ type: 'success', items });
			})
			.catch(({ message }: { message: string }): void =>
				dispatch({ type: 'error', message })
			);
	}, [type]);

	const title = `${
		type[0].toUpperCase() + type.slice(1).toLowerCase()
	} Stories`;
	const titleJSX = (
		<Helmet key={`title-${title}`}>
			<title>{title}</title>
		</Helmet>
	);

	if (state.loading === true) {
		return (
			<React.Fragment>
				{titleJSX}
				<Loading key={`loading-${title}`} />
			</React.Fragment>
		);
	}

	if (state.error) {
		return (
			<React.Fragment>
				{titleJSX}
				<p key={`error-${title}`} className="center-text error">
					{state.error}
				</p>
			</React.Fragment>
		);
	}

	return (
		<React.Fragment>
			{titleJSX}
			<ItemList key={`items-${title}`} items={state.items} />
		</React.Fragment>
	);
};

ItemsPage.propTypes = {
	type: propTypesHNTypes.isRequired,
};

export default ItemsPage;
