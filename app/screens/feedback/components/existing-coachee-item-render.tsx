import { HStack } from "@components/view-stack";
import { Colors, Spacing } from "@styles";
import { dimensions } from "@config/platform.config";
import { TouchableOpacity, View } from "react-native";
import { IconBubble, IconHeart, IconHeartBw } from "@assets/svgs"
import Spacer from "@components/spacer";
import { Text } from "@components";
import React from "react";
import { ExistingCoacheeModel } from "app/store/store.feedback";

type ExistingCoacheeItemRenderProps = {
  item: ExistingCoacheeModel
  index: number
  selectedCoachee: string
  onPressRequestFeedback(id: string): void
  onPressPreviousFeedback(): void
  onPressExistingCoachee(id: string): void
}

export const ExistingCoacheeItemRender = (
  {
    item,
    index,
    selectedCoachee,
    onPressRequestFeedback = () => null,
    onPressPreviousFeedback = () => null,
    onPressExistingCoachee = () => null,
  }: ExistingCoacheeItemRenderProps) => {


  const renderButtonTagged = (isButtonDisabled: boolean, hasPreviousFeedback: boolean, coach_id: string) => {
    // console.log(`isButtonDisabled: ${isButtonDisabled}`)
    return (
      <HStack style={{ width: dimensions.screenWidth - Spacing[128] }}>
        <TouchableOpacity onPress={() => onPressRequestFeedback(item.coachee_id)} style={{ flex: 1, backgroundColor: Colors.ABM_MAIN_BLUE, borderTopStartRadius: Spacing[12], borderBottomStartRadius: Spacing[12], alignItems: 'center' }}>
          <HStack horizontal={Spacing[8]} style={{ height: Spacing[42] }}>
            <Spacer width={Spacing[2]} />
            <IconBubble height={Spacing[28]} width={Spacing[28]} />
            <Spacer width={Spacing[4]} />
            <Text type={'label'} style={{ lineHeight: Spacing[16], color: Colors.WHITE }} text={'Request\nfeedback.'} numberOfLines={2} />
            <Spacer width={Spacing[2]} />
          </HStack>
        </TouchableOpacity>
        {/* <View style={{ backgroundColor: Colors.ABM_DARK_BLUE, width: Spacing[1], height: '100%' }} /> */}
        <TouchableOpacity onPress={() => onPressPreviousFeedback(item.coachee_id)} style={{ flex: 1, backgroundColor: hasPreviousFeedback ? Colors.ABM_MAIN_BLUE : Colors.GRAY_DISABLEB, borderTopEndRadius: Spacing[12], borderBottomEndRadius: Spacing[12], alignItems: 'center' }} disabled={!hasPreviousFeedback}>
          <HStack horizontal={Spacing[8]} style={{ height: Spacing[42] }}>
            <Spacer width={Spacing[2]} />
            {hasPreviousFeedback === true ? <IconHeart height={Spacing[28]} width={Spacing[28]} /> : <IconHeartBw height={Spacing[28]} width={Spacing[28]} />}
            <Spacer width={Spacing[4]} />
            <Text type={'label'} style={{ lineHeight: Spacing[16], color: Colors.WHITE }} text={'Feedback\nSebelumnya.'} numberOfLines={2} />
            <Spacer width={Spacing[2]} />
          </HStack>
        </TouchableOpacity>
      </HStack>
    )

  }

  return (
    <HStack>

      {selectedCoachee === item.coachee_id ? renderButtonTagged(item.is_button_disabled === 1, item.has_previous_feedback === 1, item.coachee_id) :
        <TouchableOpacity key={item.coachee_id} onPress={() => { onPressExistingCoachee(item.coachee_id) }} style={{ height: Spacing[42], borderTopWidth: index === 0 ? Spacing[0] : Spacing[1], width: '100%' }}>
          <Text type={"label"} style={{ lineHeight: Spacing[42] }}>{item.user_fullname}</Text>
        </TouchableOpacity>
      }
    </HStack>
  )
}
