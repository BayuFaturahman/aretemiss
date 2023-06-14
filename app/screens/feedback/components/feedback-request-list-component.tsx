import React from "react";
import {VStack} from "@components/view-stack";
import {Spacing} from "@styles";
import {Text} from "@components";
import Spacer from "@components/spacer";
import {EmptyList} from "@screens/notification/components/empty-list";
import {IconSadColor} from "@assets/svgs";
import { ExistingCoacheeModel } from "app/store/store.feedback";
import { FeedbackRequestListItemRender } from "./feedback-request-list-item-render";

export type FeedbackRequestListComponentProps = {
  data: ExistingCoacheeModel;
  index: number;
  onPressActivity(): void;
  selectedActivities(): void;
  onPressNote(): void;
  onPressFeedback(): void;
  onPressNoteFeedback(): void;
  goToCoaching(): void
}


export const FeedbackRequestListComponent = ({
   data,
   index,
   onPressActivity,
   selectedActivities,
   onPressNote,
   onPressFeedback,
   onPressNoteFeedback,
   goToCoaching = ()=> null }:FeedbackRequestListComponentProps) => {

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
      <FeedbackRequestListItemRender
        item={data}
        index={index}
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
