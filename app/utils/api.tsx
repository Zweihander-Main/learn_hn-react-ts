import { HNItem, HNUser, HNTypes } from '../types';

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

/**
 * Fetches a single item
 *
 * @param      {number}  id      The identifier
 */
export function fetchItem(id: number): Promise<HNItem> {
	return fetch(`${api}/item/${id}${json}`).then(
		(res: Response) => res.json() as Promise<HNItem>
	);
}

/**
 * Fetched a single comment
 *
 * @param      {number}  id      The identifier
 */
export function fetchComment(id: number): Promise<HNItem | null> {
	return fetchItem(id).then((comment: HNItem) => {
		if (notDeleted(comment) && isComment(comment) && notDead(comment)) {
			return comment;
		}
		return null;
	});
}

/**
 * Fetches all comments in given id array
 *
 * @param      {Array<number>}  ids     The identifiers
 */
export function fetchComments(ids: Array<number>): Promise<Array<HNItem>> {
	return Promise.all(ids.map(fetchItem)).then((comments: Array<HNItem>) =>
		removeDeleted(onlyComments(removeDead(comments)))
	);
}

/**
 * Fetched all posts of a given post type
 *
 * @param      {HNTypes}  type    The type of posts to fetch
 */
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

/**
 * Fetches data for a single user
 *
 * @param      {string}  id      The identifier
 */
export function fetchUser(id: string): Promise<HNUser> {
	return fetch(`${api}/user/${id}${json}`).then(
		(res: Response) => res.json() as Promise<HNUser>
	);
}

/**
 * Fetches all posts in a given post id array
 *
 * @param      {Arraynumber}  ids     The identifiers
 */
export function fetchPosts(ids: Array<number>): Promise<Array<HNItem>> {
	return Promise.all(ids.map(fetchItem)).then((posts: Array<HNItem>) =>
		removeDeleted(onlyPosts(removeDead(posts)))
	);
}
