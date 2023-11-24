let INDEX_ACCESS_REGEX = /\[\d+\]$/;

/**
 * Arrange FormData entries into a proper object.
 * Supports nested object and array by parsing the entry name:
 *
 * - "category.weight" -> { category: { weight: ... }}
 * - "attributes[0].name" -> { attributes: [ { name: ... } ] }
 */
export function formDataToObject(
	formData: FormData | IterableIterator<[string, FormDataEntryValue]>
) {
	let data: Record<string, any> = {};
	let fields = formData instanceof FormData ? formData.entries() : formData;
	let field = fields.next();

	while (!field.done) {
		let [key, value] = field.value;
		let parent: Record<string, any> = data;
		let segments = key.split(".");

		for (let i = 0; i < segments.length; i++) {
			let segment = segments[i];
			let indexAccess = INDEX_ACCESS_REGEX.exec(segment)?.at(0);

			if (indexAccess) {
				segment = segment.slice(0, -indexAccess!.length);

				if (!parent[segment]) parent[segment] = [];
				let index = Number(indexAccess!.slice(1, -1));

				if (i < segments.length - 1) {
					if (!parent[segment][index]) parent[segment][index] = {};
					parent = parent[segment][index];
				} else {
					parent[segment][index] = value;
				}
			} else {
				if (i < segments.length - 1) {
					if (!parent[segment]) parent[segment] = {};
					parent = parent[segment];
				} else {
					parent[segment] = value;
				}
			}
		}

		field = fields.next();
	}

	return data;
}
