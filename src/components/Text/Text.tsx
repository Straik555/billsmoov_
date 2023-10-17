import React, { FC, useMemo } from "react";
import { TextProps, TextVariant } from "./Text.model";
import { IonText } from "@ionic/react";

const Text: FC<TextProps> = ({
  variant = TextVariant.Text,
  children,
  className
}) => {
  const contentText = useMemo(() => {
    return variant === TextVariant.Money
      ? `$${Number(children || 0).toFixed(2)}`
      : children
  }, [children, variant])
  return (
    <IonText className={className}>
      {contentText}
    </IonText>
  )
}

export default Text
