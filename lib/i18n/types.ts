import type { en } from "./en"

export type Dictionary = typeof en

type NestedKeys<T> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? `${K}.${NestedKeys<T[K]>}`
    : K
}[keyof T & string]

export type TranslationKey = NestedKeys<Dictionary>
