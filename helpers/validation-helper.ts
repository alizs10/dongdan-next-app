import { ZodSchema } from "zod";

export const zValidate = (schema: ZodSchema, data: object) => {
    const validationRes = schema.safeParse(data);

    if (!validationRes.success) {
        const errorPaths = validationRes.error.errors.reduce((acc: { path: string; message: string[] }[], errorObj) => {
            const errorMsg = errorObj.message;
            const path = errorObj.path.join("_");

            const existingPath = acc.find(item => item.path === path);

            if (existingPath) {
                existingPath.message.push(errorMsg);
            } else {
                acc.push({ path, message: [errorMsg] });
            }

            return acc;
        }, []);

        const validationErrors = errorPaths.reduce((acc: Record<string, string>, errorPath) => {
            acc[errorPath.path] = errorPath.message[0];
            return acc;
        }, {});

        return { hasError: true, errors: validationErrors };
    }

    return {
        hasError: false,
        values: validationRes.data,
        errors: {}
    };
}
export const transformLaravelFieldErrors = (laravelErrors: Record<string, string[]>) => {

    let errors: Record<string, string> = {}

    for (const [key, value] of Object.entries(laravelErrors)) {
        let error = value[0]
        errors[key] = error
    }

    return errors
}