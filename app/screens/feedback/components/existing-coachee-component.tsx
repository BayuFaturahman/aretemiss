import React from "react";
import { HStack, VStack } from "@components/view-stack";
import { Spacing } from "@styles";
import { TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import { CoachingJournalItem } from "@screens/coaching-journal/coaching-journal.type";
import { Text } from "@components";
import Spacer from "@components/spacer";
import { EmptyList } from "@screens/notification/components/empty-list";
import sad from "@assets/icons/homepage/sad.png";
import { CoachingJournalItemRender } from "@screens/coaching-journal/components/coaching-journal-item-render";
import downArrow from "@assets/icons/down-arrow.png";
import { IconSadColor } from "@assets/svgs";
import { ExistingCoacheeModel } from "app/store/store.feedback";
import { ExistingCoacheeItemRender } from "./existing-coachee-item-render";

export type ExistingCoacheeComponentProps = {
  data: ExistingCoacheeModel;
  index: number;
  onPressRequestFeedback(): void
  onPressExistingCoachee(): void;
  onPressPreviousFeedback(): void;
  selectedCoachee: string;
}


export const ExistingCoacheeComponent = ({
  data,
  index,
  onPressRequestFeedback,
  onPressExistingCoachee,
  onPressPreviousFeedback,
  selectedCoachee
}: ExistingCoacheeComponentProps) => {

  if (data === null) {
    return (
      null
    )
  }

  return (
    <>
      <ExistingCoacheeItemRender
        item={data}
        index={index}
        onPressRequestFeedback={onPressRequestFeedback}
        onPressExistingCoachee={onPressExistingCoachee}
        onPressPreviousFeedback={onPressPreviousFeedback}
        selectedCoachee={selectedCoachee}

      />
    </>
  )

}
