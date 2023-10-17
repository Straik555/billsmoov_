import { ReactNode } from "react";

export enum NotificationVariant {
  SUCCESS = 'success',
  WARNING = 'warning',
}

export type NotificationProps = {
  icon?: string
  title?: string
  subTitle?: string | ReactNode
  variant?: NotificationVariant
  children: ReactNode
  className?: string
}
