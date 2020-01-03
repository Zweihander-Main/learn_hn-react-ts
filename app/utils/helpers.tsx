/**
 * Formats timestamp to date string
 *
 * @param      {number}  timestamp  The timestamp
 * @return     {string}  { date string }
 */
export function formatDate(timestamp: number): string {
	return new Date(timestamp * 1000).toLocaleDateString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
	});
}
