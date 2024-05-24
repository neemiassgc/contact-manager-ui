type ColorRole =
  "primary" | "on-primary" | "primary-container" | "on-primary-container" |
  "secondary" | "on-secondary" | "secondary-container" | "on-secondary-container" |
  "tertiary" | "on-tertiary" | "tertiary-container" | "on-tertiary-container" |
  "error" | "on-error" | "surface" | "on-surface" | "error-container" | "on-error-container" |
  "surface-variant" | "on-surface-variant" | "outline" | "outline-variant" | "surface-container" |
  "surface-container-low" | "surface-container-lowest" | "surface-container-high" | "surface-container-highest"

const colorMap: {
  [propName: string]: string
} = {
  primary: "rgb(37 106 74)",
  "on-primary": "rgb(255 255 255)",
  "primary-container": "rgb(171 242 201)",
  "on-primary-container": "rgb(0 33 18)",
  secondary: "rgb(78 99 86)",
  "on-secondary": "rgb(255 255 255)",
  "secondary-container": "rgb(208 232 215)",
  "on-secondary-container": "rgb(11 31 21)",
  tertiary: "rgb(60 100 114)",
  "on-tertiary": "rgb(255 255 255)",
  "tertiary-container": "rgb(192 233 250)",
  "on-tertiary-container": "rgb(0 31 40)",
  error: "rgb(186 26 26)",
  "on-error": "rgb(255 255 255)",
  "error-container": "rgb(255 218 214)",
  "on-error-container": "rgb(65 0 2)",
  surface: "rgb(246 251 244)",
  "on-surface": "rgb(23 29 25)",
  "surface-variant": "rgb(220 229 220)",
  "on-surface-variant": "rgb(64 73 67)",
  outline: "rgb(112 121 114)",
  "outline-variant": "rgb(192 201 193)",
  "surface-container": "rgb(234 239 233)",
  "surface-container-lowest": "rgb(255 255 255)",
  "surface-container-low": "rgb(240 245 239)",
  "surface-container-high": "rgb(228 234 227)",
  "surface-container-highest": "rgb(222 228 222)"
}

type ColorFunc = (colorRole: ColorRole) => object;

export const text: ColorFunc = colorRole => ({color: colorMap[colorRole]})

export const border: ColorFunc = colorRole => ({borderColor: colorMap[colorRole]})

export const bg: ColorFunc = colorRole => ({backgroundColor: colorMap[colorRole]})

export const color: (colorRole: ColorRole) => string = colorRole => colorMap[colorRole]

export function paint(...cssProps: object[]): object {
  return cssProps.reduce((prev, curr) => ({...prev, ...curr}), {});
}