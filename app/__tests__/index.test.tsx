import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../App';
import Comment from '../components/Comment';
import CommentTree from '../components/CommentTree';
import ItemList from '../components/ItemList';
import ItemListSingle from '../components/ItemListSingle';
import ItemMeta from '../components/ItemMeta';
import ItemsPage from '../components/ItemsPage';
import Loading from '../components/Loading';
import Nav from '../components/Nav';
import PostPage from '../components/PostPage';
import UserPage from '../components/UserPage';

import { render } from '@testing-library/react';

const testComment = { id: 0, by: '', time: 0 };

const ComponentsArray: Array<{
	component: React.FC<unknown> | React.ComponentClass;
	attrs: Record<string, unknown>;
}> = [
	{ component: App, attrs: {} },
	{
		component: Comment,
		attrs: {
			comment: testComment,
			depth: 0,
			toggleCollapse: () => {
				null;
			},
			collapsed: false,
		},
	},
	{ component: CommentTree, attrs: { parent: testComment, depth: 0 } },
	{ component: ItemList, attrs: { items: [testComment] } },
	{ component: ItemListSingle, attrs: { item: testComment } },
	{ component: ItemMeta, attrs: { by: '', time: 0, id: 0 } },
	{ component: ItemsPage, attrs: { type: 'top' } },
	{ component: Loading, attrs: {} },
	{ component: Nav, attrs: {} },
	{
		component: PostPage,
		attrs: {
			location: { state: { item: testComment } },
		},
	},
	{ component: UserPage, attrs: { location: { search: '?id=abc' } } },
];

type NJSGlobal = NodeJS.Global;

interface CustomNodeJsGlobal extends NJSGlobal {
	fetch: unknown;
}

declare const global: CustomNodeJsGlobal;

describe('Snapshots are matched for ', () => {
	global.fetch = jest.fn(() => Promise.resolve());
	ComponentsArray.forEach((ComponentObject) => {
		it(`${ComponentObject.component.name} component`, () => {
			const { component: Comp, attrs } = ComponentObject;
			const { asFragment } = render(
				<Router>
					<Comp {...attrs} />
				</Router>
			);
			expect(asFragment()).toMatchSnapshot();
		});
	});
});
