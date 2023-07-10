import React from "react";
import { HStack, VStack } from "@components/view-stack";
import { Colors, Layout, Spacing } from "@styles";
import { Button, Text } from "@components";
import Spacer from "@components/spacer";
import sick from "@assets/icons/notifications/sick.png";
import { IconSurprisedColor } from "@assets/svgs";
import { backgroundColor } from "react-native-calendars/src/style";


export const EmptyList = ({
  navigateTo = () => null,
  imageSource = () => <IconSurprisedColor height={Spacing[60]} width={Spacing[60]} />,
  isExistingCoache = true,
  isListFeedbackUser = false,
  description = isExistingCoache ? 'Belum ada Coachees sebelumnya!\nKembali lagi saat sudah ada Existing Coachees ya!' : (isListFeedbackUser ? 'Belum ada feedback user!\nKembali lagi saat sudah ada Feedback User ya!' : 'Belum ada request feedback!\nKembali lagi saat sudah ada Feedback Request ya!'),
  buttonLabel = 'Kembali'
}) => {
  return (
    <VStack horizontal={Spacing[8]} style={[Layout.widthFull, { height: isListFeedbackUser ? Spacing[112] : Spacing[160] + Spacing[12] }]} >
      <Spacer />
      <HStack bottom={Spacing[12]}>
        <Spacer />
        {imageSource()}
        <Spacer />
      </HStack>
      <Text type={'body'} style={{ textAlign: 'center', fontSize: Spacing[12] }} text={description} />
      <Spacer />
    </VStack>
  )
}
