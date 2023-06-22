import React from "react";
import { RequestFeedbackUserModel } from "app/store/store.feedback";
import { FeedbackRequestListItemRender } from "./feedback-request-list-item-render";

export type FeedbackRequestListComponentProps = {
  data: RequestFeedbackUserModel;
  index: number;
  selectedId: string;
  onPressActivity(): void
  onPressFillFeedback(): void
}


export const FeedbackRequestListComponent = ({
  data,
  index,
  selectedId,
  onPressActivity,
  onPressFillFeedback,
}: FeedbackRequestListComponentProps) => {

  if (data === null) {
    return (
      null
    )
  }

  return (
    <>
      <FeedbackRequestListItemRender
        item={data}
        index={index}
        selectedId={selectedId}
        onPressActivity={onPressActivity}
        onPressFillFeedback={onPressFillFeedback}
      />
    </>
  )
}
