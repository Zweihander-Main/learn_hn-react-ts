import * as React from 'react';
import PostListSingle from './PostListSingle';

interface PostListProps {
	items: Array<HNItem>;
}

export default class PostList extends React.Component<PostListProps> {
	constructor(props: PostListProps) {
		super(props);
	}

	render(): JSX.Element {
		const { items } = this.props;

		return (
			<ul>
				{items?.length > 0
					? items.map((item: HNItem) => {
							return <PostListSingle key={item.id} item={item} />;
					  })
					: null}
			</ul>
		);
	}
}
