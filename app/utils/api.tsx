const api = 'https://hacker-news.firebaseio.com/v0';
const json = '.json';

function notDead({ dead }: HNItem): boolean {
	return dead !== true;
}

function notDeleted({ deleted }: HNItem): boolean {
	return deleted !== true;
}

function isComment({ type }: HNItem): boolean {
	return type === 'comment';
}

function isPost({ type }: HNItem): boolean {
	return type === 'story';
}

function removeDead(posts: Array<HNItem>): Array<HNItem> {
	return posts.filter(Boolean).filter(notDead);
}

function removeDeleted(posts: Array<HNItem>): Array<HNItem> {
	return posts.filter(notDeleted);
}

function onlyComments(posts: Array<HNItem>): Array<HNItem> {
	return posts.filter(isComment);
}

function onlyPosts(posts: Array<HNItem>): Array<HNItem> {
	return posts.filter(isPost);
}

export function fetchItem(id: number): Promise<HNItem> {
	return fetch(`${api}/item/${id}${json}`).then((res: Response) =>
		res.json()
	);
}

export function fetchComment(id: number): Promise<HNItem | null> {
	return fetchItem(id).then((comment: HNItem) => {
		if (notDeleted(comment) && isComment(comment) && notDead(comment)) {
			return comment;
		}
		return null;
	});
}

export function fetchComments(ids: Array<number>): Promise<Array<HNItem>> {
	return Promise.all(ids.map(fetchItem)).then((comments: Array<HNItem>) =>
		removeDeleted(onlyComments(removeDead(comments)))
	);
}

export function fetchMainPosts(type: HNTypes): Promise<Array<HNItem>> {
	return fetch(`${api}/${type}stories${json}`)
		.then((res: Response) => res.json())
		.then((ids: Array<number>) => {
			if (!ids) {
				throw new Error(
					`There was an error fetching the ${type} posts.`
				);
			}

			return ids;
		})
		.then((ids: Array<number>) => Promise.all(ids.map(fetchItem)))
		.then((posts: Array<HNItem>) =>
			removeDeleted(onlyPosts(removeDead(posts)))
		);
}

export function fetchUser(id: string): Promise<HNUser> {
	return fetch(`${api}/user/${id}${json}`).then((res: Response) =>
		res.json()
	);
}

export function fetchPosts(ids: Array<number>): Promise<Array<HNItem>> {
	return Promise.all(ids.map(fetchItem)).then((posts: Array<HNItem>) =>
		removeDeleted(onlyPosts(removeDead(posts)))
	);
}
