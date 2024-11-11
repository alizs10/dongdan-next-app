import { ZodSchema } from "zod";

export const zValidate = (schema: ZodSchema, data: object) => {

    let validationErrors: any = {};
    let hasError = false;

    let validationRes = schema.safeParse(data)

    if (!validationRes.success) {
        hasError = true;
        let errors = validationRes.error.errors

        let errorPaths = []

        for (let errorObj of errors) {
            let errorMsg = errorObj.message;
            let paths = errorObj.path;

            let existsPath = errorPaths.find(errorPath => errorPath.path === paths.join("."))

            if (existsPath) {

                let pathIndex = errorPaths.findIndex(errorPath => errorPath.path === paths.join("_"))
                errorPaths[pathIndex].message.push(errorMsg)

            } else {
                errorPaths.push({ path: paths.join("_"), message: [errorMsg] })
            }
        }

        for (const errorPath of errorPaths) {
            validationErrors[errorPath.path] = errorPath.message[0]
        }

        return { hasError, errors: validationErrors }
    }


    return { hasError, values: validationRes.data, errors: validationErrors }
}