var maxWeight = 1;

function processData(data) {
	var i = 0;
	while(data.length > i) {
		var j = i+1;
		data[i].weight = 1;
		while(data.length > j) {
			if(areEqual(data[j], data[i])) {
				data.splice(j, 1);
				data[i].weight++;
				maxWeight = Math.max(data[i].weight, maxWeight);
			}
			++j;
		}
		++i;
	}
	return data;
}

function areEqual(a, b) {
	keys = Object.keys( a );
	for(var i = 1; i < keys.length; i++) {
		var curKey = keys[i];
		if(a[curKey] != b[curKey] && curKey != "weight") {
			return false;
		}
	}
	return true;
}