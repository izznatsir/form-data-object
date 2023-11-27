type UnknownRecord = Record<string, unknown>;

let INDEX_ACCESS_REGEX = /\[\d+\]$/;

/**
 * Arrange iterable entries (key value pairs) into a proper object.
 * Supports nested object and array by parsing the entry name:
 *
 * - "category.weight" -> { category: { weight: ... }}
 * - "attributes[0].name" -> { attributes: [ { name: ... } ] }
 * - "tags" & "tags" & ... -> { tags: [...] }
 */
export function entriesToObject(
	entries: Iterable<[key: string, value: unknown]>
) {
	let data: Record<string, unknown> = {};

	for (let [key, value] of entries) {
		let parent: Record<string, any> = data;
		let segments = key.split(".");

		for (let i = 0; i < segments.length; i++) {
			let segment = segments[i];
			if (!segment) continue;

			let indexAccess = INDEX_ACCESS_REGEX.exec(segment)?.at(0);
			if (indexAccess) {
				segment = segment.slice(0, -indexAccess!.length);

				if (!parent[segment]) parent[segment] = [];
				let index = Number(indexAccess!.slice(1, -1));

				/**
				 * If current segment has index and there is more segments
				 * it must be an array of object.
				 */
				if (i < segments.length - 1) {
					if (!parent[segment][index]) parent[segment][index] = {};
					parent = parent[segment][index];
				} else {
					/**
					 * If current segment is the last segment with index,
					 * assign the value at the index.
					 */
					parent[segment][index] = value;
				}
			} else {
				/** If there is more segments it must be an object. */
				if (i < segments.length - 1) {
					if (!parent[segment]) parent[segment] = {};
					parent = parent[segment] as UnknownRecord;
				} else if (parent[segment]) {
					/**
					 * If current segment is the last segment with duplicate,
					 * it must be an array.
					 */
					if (!Array.isArray(parent[segment]))
						parent[segment] = [parent[segment]];
					parent[segment].push(value);
				} else {
					/**
					 * If current segment is the last segment without duplicate,
					 * just assign the value.
					 */
					parent[segment] = value;
				}
			}
		}
	}

	return data;
}
