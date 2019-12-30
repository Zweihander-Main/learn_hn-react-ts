const api = 'https://hacker-news.firebaseio.com/v0';
const json = '.json?print=pretty';

function removeDead(posts: Array<HNItem>): Array<HNItem> {
	return posts.filter(Boolean).filter(({ dead }: HNItem) => dead !== true);
}

function removeDeleted(posts: Array<HNItem>): Array<HNItem> {
	return posts.filter(({ deleted }: HNItem) => deleted !== true);
}

function onlyComments(posts: Array<HNItem>): Array<HNItem> {
	return posts.filter(({ type }: HNItem) => type === 'comment');
}

function onlyPosts(posts: Array<HNItem>): Array<HNItem> {
	return posts.filter(({ type }: HNItem) => type === 'story');
}

export function fetchItem(id: number): Promise<HNItem> {
	return fetch(`${api}/item/${id}${json}`).then((res: Response) =>
		res.json()
	);
}

export function fetchComments(ids: Array<number>): Promise<Array<HNItem>> {
	return Promise.all(ids.map(fetchItem)).then((comments: Array<HNItem>) =>
		removeDeleted(onlyComments(removeDead(comments)))
	);
}

export function fetchMainPosts(
	type: 'top' | 'new' | 'best' | 'ask' | 'show' | 'job'
): Promise<Array<HNItem>> {
	return fetch(`${api}/${type}stories${json}`)
		.then((res: Response) => res.json())
		.then((ids: Array<number>) => {
			if (!ids) {
				throw new Error(
					`There was an error fetching the ${type} posts.`
				);
			}

			return ids.slice(0, 50);
		})
		.then((ids: Array<number>) => Promise.all(ids.map(fetchItem)))
		.then((posts: Array<HNItem>) =>
			removeDeleted(onlyPosts(removeDead(posts)))
		);
}

export function fetchUser(id: number): Promise<HNUser> {
	return fetch(`${api}/user/${id}${json}`).then((res: Response) =>
		res.json()
	);
}

export function fetchPosts(ids: Array<number>): Promise<Array<HNItem>> {
	return Promise.all(ids.map(fetchItem)).then((posts: Array<HNItem>) =>
		removeDeleted(onlyPosts(removeDead(posts)))
	);
}
