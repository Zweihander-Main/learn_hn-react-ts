export function formatDate(timestamp: number): string {
	return new Date(timestamp * 1000).toLocaleDateString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
	});
}
