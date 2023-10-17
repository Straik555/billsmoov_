import {ReactNode} from "react";

export enum TextVariant {
  Text = 'text',
  Money = 'money',
}

export type TextProps = {
  variant?: TextVariant
  children?: ReactNode
  className?: string
}
