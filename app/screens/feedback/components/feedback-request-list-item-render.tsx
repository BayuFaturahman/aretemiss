import { HStack } from "@components/view-stack";
import { Colors, Spacing } from "@styles";
import { dimensions } from "@config/platform.config";
import { TouchableOpacity, View } from "react-native";
import { IconBubbleHeart, IconHeart, IconHeartBw } from "@assets/svgs"
import Spacer from "@components/spacer";
import { Text } from "@components";
import React from "react";
import { ExistingCoacheeModel } from "app/store/store.feedback";

type FeedbackRequestListItemRenderProps = {
  item: ExistingCoacheeModel
  index: number
  selectedActivities: string
  onPressRequestFeedback(): void
  onPressPreviousFeedback(): void
  onPressActivity(id: string): void
  onPressNote(id: string, coach_id: string): void
  onPressFeedback(id: string, coach_id: string): void
  onPressNoteFeedback(id: string, coach_id: string): void
  isHomepageComponent?: boolean
}

export const FeedbackRequestListItemRender = (
  {
    item,
    index,
    selectedActivities,
    onPressRequestFeedback = () => null,
    onPressPreviousFeedback = () => null,
    onPressActivity = () => null,
    onPressNote = () => null,
    onPressFeedback = () => null,
    onPressNoteFeedback = () => null,
    isHomepageComponent = false
  }: FeedbackRequestListItemRenderProps) => {


  const renderButtonTagged = (isButtonDisabled: boolean, hasPreviousFeedback: boolean, coach_id: string) => {
    console.log(`isButtonDisabled: ${isButtonDisabled}`)
    return (
      <HStack style={{ width: dimensions.screenWidth - Spacing[128] }}>
        <TouchableOpacity onPress={() => { }} style={{ flex: 1, backgroundColor: Colors.ABM_MAIN_BLUE, borderTopStartRadius: Spacing[12], borderBottomStartRadius: Spacing[12], borderTopEndRadius: Spacing[12], borderBottomEndRadius: Spacing[12], alignItems: 'center' }}>
          <HStack horizontal={Spacing[8]} style={{ height: Spacing[36] + Spacing[4] }}>
            <Spacer width={Spacing[2]} />
            <IconBubbleHeart height={Spacing[28]} width={Spacing[28]} />
            <Spacer width={Spacing[4]} />
            <Text type={'label'} style={{ lineHeight: Spacing[16], color: Colors.WHITE }} text={'Isi feedback.'} numberOfLines={2} />
            <Spacer width={Spacing[2]} />
          </HStack>
        </TouchableOpacity>

      </HStack>
    )

  }

  return (
    <HStack>

      {selectedActivities === item.coachee_id ? renderButtonTagged(item.is_button_disabled === 1, item.has_previous_feedback === 1, item.coachee_id) :
        <TouchableOpacity key={item.coachee_id} onPress={() => { onPressActivity(item.coachee_id) }} style={{ height: Spacing[42], borderTopWidth: index === 0 ? Spacing[0] : Spacing[1], width: '100%' }}>
          <Text type={"label"} style={{ lineHeight: Spacing[36] + Spacing[4] }}>{item.user_fullname}</Text>
        </TouchableOpacity>
      }
    </HStack>
  )
}
