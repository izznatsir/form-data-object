import { type ZodObject, type ZodRawShape } from "zod";

export interface PreprocessFormDataWithZodFuncArgs<S extends ZodRawShape> {
	formData: FormData;
	schema: ZodObject<S>;
	options?: {
		true?: string;
	};
}

export function preprocessFormDataWithZod<S extends ZodRawShape>({
	formData,
	schema,
	options,
}: PreprocessFormDataWithZodFuncArgs<S>): Record<
	number | string | symbol,
	unknown
> {
	if (schema._def.typeName !== "ZodObject")
		throw new TypeError(
			"Schema type other than `ZodObject` is not supported."
		);

	const properties = Object.entries(schema._def.shape());

	const object: Record<number | string | symbol, unknown> = {};
	for (const [key, { _def }] of properties) {
		switch (_def.typeName) {
			case "ZodArray": {
				const values = formData.getAll(key).map((value) => {
					switch (_def.type._def.typeName) {
						case "ZodBoolean": {
							return value === (options?.true || "");
						}
						case "ZodEffects": {
							if (value instanceof File) return value;
							return;
						}
						case "ZodNumber": {
							return Number(value);
						}
						case "ZodString": {
							return String(value);
						}
						case "ZodObject": {
							if (typeof value === "string")
								try {
									return JSON.parse(value);
								} catch {}

							return;
						}
						default: {
							throw new TypeError(
								"Array in an array or object in an object are not supported."
							);
						}
					}
				});
				object[key] = values;
				break;
			}
			case "ZodBoolean": {
				const value = formData.get(key);
				object[key] = value === (options?.true || "");
				break;
			}
			case "ZodEffects": {
				const value = formData.get(key);
				if (value instanceof File) object[key] = value;
				break;
			}
			case "ZodNumber": {
				object[key] = Number(formData.get(key));
				break;
			}
			case "ZodObject": {
				let value;
				const json = formData.get(key);

				if (typeof json === "string")
					try {
						value = JSON.parse(json);
					} catch {}

				object[key] = value;
				break;
			}
			case "ZodString": {
				object[key] = String(formData.get(key));
				break;
			}
		}
	}

	return object;
}
