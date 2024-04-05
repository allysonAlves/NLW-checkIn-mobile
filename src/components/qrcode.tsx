import { colors } from "@/styles/colors";
import { View, Text } from "react-native";
import QRCodeSvg from "react-native-qrcode-svg";

type Props = {
  value: string;
  size: number;
};

export default function QRCode({ value, size }: Props) {
  return (
    <QRCodeSvg
      value={value}
      size={size}
      color={colors.white}
      backgroundColor="transparent"
    />
  );
}
