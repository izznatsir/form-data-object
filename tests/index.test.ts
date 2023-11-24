import { test } from "vitest";
import { formDataToObject } from "~/index";

test("should corrrectly collect deeply nested object", ({ expect }) => {
	let formData = new FormData();
	formData.append("attributes.tools.weight", "1200");
	formData.append("attributes.tools.material", "Iron");
	formData.append("attributes.metals.material", "Iron");
	formData.append("extras[0].name", "Tools");
	formData.append("extras[0].description", "A unique name for the tool.");
	formData.append("tags[0]", "Premium");

	let data = formDataToObject(formData);
	expect(data).toBeTruthy();
});
