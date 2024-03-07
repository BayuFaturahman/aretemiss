import { HStack } from "@components/view-stack";
import { Colors, Spacing } from "@styles";
import { dimensions } from "@config/platform.config";
import { TouchableOpacity } from "react-native";
import { IconBubbleHeart } from "@assets/svgs"
import Spacer from "@components/spacer";
import { Text } from "@components";
import React from "react";
import { RequestFeedbackUserModel } from "app/store/store.feedback";

type FeedbackRequestListItemRenderProps = {
  item: RequestFeedbackUserModel
  index: number
  selectedId: string
  onPressActivity(): void
  onPressFillFeedback(): void
}

export const FeedbackRequestListItemRender = (
  {
    item,
    index,
    selectedId,
    onPressActivity = () => null,
    onPressFillFeedback = () => null
  }: FeedbackRequestListItemRenderProps) => {


  const renderButtonTagged = () => {
    return (
      <HStack style={{ width: dimensions.screenWidth - Spacing[128] }}>
        <TouchableOpacity onPress={() => onPressFillFeedback(item.rfu_user_from_id)} style={{ flex: 1, backgroundColor: Colors.ABM_MAIN_BLUE, borderTopStartRadius: Spacing[12], borderBottomStartRadius: Spacing[12], borderTopEndRadius: Spacing[12], borderBottomEndRadius: Spacing[12], alignItems: 'center' }}>
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

  return (selectedId === item.rfu_user_from_id ? renderButtonTagged() :
    <TouchableOpacity key={item.rfu_user_from_id} onPress={() => { onPressActivity(item.rfu_user_from_id) }} style={{ height: Spacing[42], borderTopWidth: index === 0 ? Spacing[0] : Spacing[1], width: '100%' }}>
      <Text type={"label"} style={{ lineHeight: Spacing[36] + Spacing[4] }}>{item.user_fullname}</Text>
    </TouchableOpacity>

  )
}
