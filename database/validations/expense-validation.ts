import { z, ZodType } from "zod";
import { expendSchema } from "./expend-validation";
import { transferSchema } from "./transfer-validation";
import { Expense } from "@/types/event-types";

export const expenseSchema: ZodType<Expense> = z.union([expendSchema, transferSchema])