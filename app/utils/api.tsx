const id = 'YOUR_CLIENT_ID';
const sec = 'YOUR_SECRET_ID';
const params = `?client_id=${id}&client_secret=${sec}`;

function getErrorMsg(message: string, username: string): string {
	if (message === 'Not Found') {
		return `${username} doesn't exist`;
	}
	return message;
}

function getProfile(username: string): Promise<GitHubUsersResponse> {
	return fetch(`https://api.github.com/users/${username}${params}`)
		.then((res: Response) => res.json())
		.then((profile: GitHubUsersResponse) => {
			if (profile.message) {
				throw new Error(getErrorMsg(profile.message, username));
			}
			return profile;
		});
}

function getRepos(username: string): Promise<Array<GitHubRepoItem>> {
	return fetch(
		`https://api.github.com/users/${username}/repos${params}&per_page=100`
	)
		.then((res: Response) => res.json())
		.then((repos: GitHubUserRepoResponse) => {
			if (!Array.isArray(repos) && repos.message) {
				throw new Error(getErrorMsg(repos.message, username));
			}
			return repos as Array<GitHubRepoItem>;
		});
}

function getStarCount(repos: Array<GitHubRepoItem>): number {
	return repos.reduce(
		(
			count: number,
			{ stargazers_count: stargazersCount }: GitHubRepoItem
		) => count + stargazersCount,
		0
	);
}

function calculateScore(
	followers: number,
	repos: Array<GitHubRepoItem>
): number {
	return followers * 3 + getStarCount(repos);
}

function getUserData(player: string): Promise<UserData> {
	return Promise.all([getProfile(player), getRepos(player)]).then(
		([profile, repos]: [GitHubUsersResponse, Array<GitHubRepoItem>]) =>
			({
				profile,
				score: calculateScore(profile.followers, repos),
			} as UserData)
	);
}

function sortPlayers(players: [UserData, UserData]): [UserData, UserData] {
	return players.sort((a, b) => b.score - a.score);
}

export function battle(
	players: [string, string]
): Promise<[UserData, UserData]> {
	return Promise.all([
		getUserData(players[0]),
		getUserData(players[1]),
	]).then((results: [UserData, UserData]) => sortPlayers(results));
}

export function fetchPopularRepos(
	language: possibleLanguage
): Promise<Array<GitHubRepoItem>> {
	const endpoint = window.encodeURI(
		`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`
	);

	return fetch(endpoint)
		.then((res: Response) => res.json())
		.then((data: GitHubSearchReponse<GitHubRepoItem>) => {
			if (!data.items) {
				throw new Error(data.message);
			}

			return data.items;
		});
}
