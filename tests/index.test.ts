import { test } from "vitest";
import { z } from "zod";
import { preprocessFormDataWithZod } from "~/index";

test("should preprocess properties with literal values.", async ({
	expect,
}) => {
	const formData = new FormData();
	formData.append("name", "Silver Spoon");
	formData.append("quantity", "48");
	formData.append("isDiscontinued", "");
	formData.append("tags", "kitchen");
	formData.append("tags", "utensils");
	formData.append(
		"extras",
		JSON.stringify({
			lengthMm: 100,
			weightGram: 50,
		})
	);
	formData.append(
		"picture",
		new File([], "silvers-spoon.png", { type: "image/png" })
	);

	const schema = z.object({
		name: z.string(),
		quantity: z.number(),
		isDiscontinued: z.boolean(),
		tags: z.array(z.string()),
		extras: z.object({
			lengthMm: z.number(),
			weightGram: z.number(),
		}),
		picture: z.instanceof(File),
	});

	const formDataObject = preprocessFormDataWithZod({ formData, schema });
});
