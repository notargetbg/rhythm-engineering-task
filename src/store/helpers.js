export function getColumnNames(data) {
	return Object.keys(data).filter(x => x !== 'year');
}

export function formatColumnName(data) {
	return data.split('_').join(' ');
}