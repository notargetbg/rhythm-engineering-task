export function getColumnNames(data, exclude = '') {
	return Object.keys(data).filter(x => x !== exclude);
}

export function formatColumnName(data) {
	return data.split('_').join(' ').toLowerCase();
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

export function getMaxFromMultipleCategories(table) {
	return Object.keys(table).reduce((acc, key) => {
		const max = table[key].reduce((acc, item) => acc > item.count ? acc : item.count, 0);
		return (acc > max) ? acc : max;
	}, 0);
}

export function transformFromStrToDate(data, type, callback) {
	Object.keys(data).forEach((key) => {
		data[key] = data[key].map(x => {
			x[type] = callback(x[type]);
			return x;
		});
	});
}