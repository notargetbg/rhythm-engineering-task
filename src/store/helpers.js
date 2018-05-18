export function getColumnNames(data, exclude = '') {
	return Object.keys(data).filter(x => x !== exclude);
}

export function formatColumnName(data) {
	return data.split('_').join(' ');
}

export function getDimensions(width, height) {
	return {
		top: 30,
		right: 20,
		bottom: 20,
		left: 50,
		innerWidth: width - 80,
		innerHeight: height - 60
	};
}

export function transformTableData(data, category, column) {
	return data.map((x) => {
		return {
			category: x[category],
			data: x[column]
		};
	});
}