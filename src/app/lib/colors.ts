export type ColorRole =
  "primary" | "on-primary" | "primary-container" | "on-primary-container" |
  "secondary" | "on-secondary" | "secondary-container" | "on-secondary-container" |
  "tertiary" | "on-tertiary" | "tertiary-container" | "on-tertiary-container" |
  "error" | "on-error" | "surface" | "on-surface" | "error-container" | "on-error-container" |
  "surface-variant" | "on-surface-variant" | "outline" | "outline-variant" | "surface-container" |
  "surface-container-low" | "surface-container-lowest" | "surface-container-high" | "surface-container-highest"

const colorMap: {
  [propName: string]: string
} = {
  primary: 'rgb(0 106 106)',
  'on-primary': 'rgb(255 255 255)',
  'primary-container': 'rgb(156 241 240)',
  'on-primary-container': 'rgb(0 32 32)',
  secondary: 'rgb(74 99 99)',
  'on-secondary': 'rgb(255 255 255)',
  'secondary-container': 'rgb(204 232 231)',
  'on-secondary-container': 'rgb(5 31 31)',
  tertiary: 'rgb(75 96 124)',
  'on-tertiary': 'rgb(255 255 255)',
  'tertiary-container': 'rgb(211 228 255)',
  'on-tertiary-container': 'rgb(4 28 53)',
  error: 'rgb(186 26 26)',
  'on-error': 'rgb(255 255 255)',
  'error-container': 'rgb(255 218 214)',
  'on-error-container': 'rgb(65 0 2)',
  surface: 'rgb(244 251 250)',
  'on-surface': 'rgb(22 29 29)',
  'surface-variant': 'rgb(218 229 228)',
  'on-surface-variant': 'rgb(63 73 72)',
  outline: 'rgb(111 121 121)',
  'outline-variant': 'rgb(190 201 200)',
  'surface-container-lowest': 'rgb(255 255 255)',
  'surface-container-low': 'rgb(239 245 244)',
  'surface-container': 'rgb(233 239 238)',
  'surface-container-high': 'rgb(227 233 233)',
  'surface-container-highest': 'rgb(221 228 227)'
}

type ColorFunc = (colorRole: ColorRole) => object;

export const text: ColorFunc = colorRole => ({color: colorMap[colorRole]})

export const border: ColorFunc = colorRole => ({borderColor: colorMap[colorRole]})

export const bg: ColorFunc = colorRole => ({backgroundColor: colorMap[colorRole]})

export const color: (colorRole: ColorRole) => string = colorRole => colorMap[colorRole]

export function paint(...cssProps: object[]): object {
  return cssProps.reduce((prev, curr) => ({...prev, ...curr}), {});
}

const textTertiary = text("tertiary");
const borderTertiary = border("tertiary");

export const textFieldTheme: object = {
  sx: {
    "& label, label.Mui-focused": textTertiary,
    '& .MuiOutlinedInput-root': {
      '& fieldset': borderTertiary,
      '&:hover fieldset': borderTertiary,
      '&.Mui-focused fieldset': borderTertiary,
    },
  },
  inputProps: {
    sx: {
      "&::placeholder": textTertiary,
      ...textTertiary
    }
  }
}