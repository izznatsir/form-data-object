import { test } from "vitest";
import { entriesToObject } from "~/index";

test("should corrrectly create object from form data with nested objects and array of objects.", ({
	expect,
}) => {
	let formData = new FormData();
	formData.append("attributes.tools.weight", "1200");
	formData.append("attributes.tools.material", "Iron");
	formData.append("attributes.metals.material", "Iron");
	formData.append("extras[0].name", "Tools");
	formData.append("extras[0].description", "A unique name for the tool.");
	formData.append("tags[0]", "Premium");
	formData.append("tags", "Limited");

	let data = entriesToObject(formData);

	expect(data).toEqual({
		attributes: {
			tools: {
				weight: "1200",
				material: "Iron",
			},
			metals: {
				material: "Iron",
			},
		},
		extras: [
			{
				name: "Tools",
				description: "A unique name for the tool.",
			},
		],
		tags: ["Premium", "Limited"],
	});
});
