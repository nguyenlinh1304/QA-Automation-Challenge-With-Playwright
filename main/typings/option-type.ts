/**
 * Base type for option IDs used in Select components.
 * Can be string or number, or stricter union types for specific fields.
 */
export type OptionIdType = string | number;

// Example: Gender options
export type GenderOption = 'male' | 'female' | 'other';

// Example: Department options (IDs from backend)
export type DepartmentOption = 1 | 2 | 3;
