import React from "react";
import {HStack, VStack} from "@components/view-stack";
import {Spacing} from "@styles";
import {TouchableOpacity} from "react-native";
import FastImage from "react-native-fast-image";
import {CoachingJournalItem} from "@screens/coaching-journal/coaching-journal.type";
import {Text} from "@components";
import Spacer from "@components/spacer";
import {EmptyList} from "@screens/notification/components/empty-list";
import sad from "@assets/icons/homepage/sad.png";
import {CoachingJournalItemRender} from "@screens/coaching-journal/components/coaching-journal-item-render";
import downArrow from "@assets/icons/down-arrow.png";
import {IconSadColor} from "@assets/svgs";
import { ExistingCoacheeModel } from "app/store/store.feedback";
import { ExistingCoacheeItemRender } from "./existing-coachee-item-render";

export type ExistingCoacheeComponentProps = {
  data: ExistingCoacheeModel;
  index: number;
  onPressRequestFeedback(): void
  onPressActivity(): void;
  selectedActivities(): void;
  onPressNote(): void;
  onPressFeedback(): void;
  onPressNoteFeedback(): void;
  goToCoaching(): void
}


export const ExistingCoacheeComponent = ({
   data,
   index,
   onPressRequestFeedback,
   onPressActivity,
   selectedActivities,
   onPressNote,
   onPressFeedback,
   onPressNoteFeedback,
   goToCoaching = ()=> null }:ExistingCoacheeComponentProps) => {

  if(data === null){
    return(
      <VStack>
        <Text type={'left-header'} style={{fontSize: Spacing[16]}} underlineWidth={Spacing[72]} text="Coaching Journal." />
        <Spacer width={Spacing[24]} />
        <EmptyList buttonLabel={'Tambah sekarang!'}
                   description={'Kamu belum menambahkan catatan coaching journal.'}
                   imageSource={()=> <IconSadColor height={Spacing[42]} width={Spacing[42]}/>} navigateTo={goToCoaching}/>
      </VStack>
    )
  }

  return(
    <>
      <ExistingCoacheeItemRender
        item={data}
        index={index}
        onPressRequestFeedback={onPressRequestFeedback}
        onPressActivity={onPressActivity}
        selectedActivities={selectedActivities}
        onPressNote={onPressNote}
        onPressFeedback={onPressFeedback}
        onPressNoteFeedback={onPressNoteFeedback}
        isHomepageComponent
      />
    </>
  )

}
