import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert prisma object into a regular Js object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

//Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}

//Format errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error.name === "ZodError") {
    const fieldErrors = Object.keys(error.errors).map((field) => error.errors[field].message).join(", ");
    return fieldErrors;
  } else if (error.name === "PrismaClientKnownRequestError") {
    // Handle prisma errors
    const field = error.meta?.target ? error.meta?.target[0] : "field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    return error.message;
  }
}

//Round number to 2 decimal places
export function roundTo2DecimalPlaces(value: number | string) {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON * 100)) / 100;
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON * 100)) / 100;
  }
  throw new Error("Value is not a number or string");
}
