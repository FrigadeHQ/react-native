import React, {FC} from "react";
import {OnboardFlow, OnboardFlowProps, PageData, TextStyles} from "react-native-onboard";
import {useGetMyFlow} from "../api/flows";


interface FrigadeFlowProps extends OnboardFlowProps, TextStyles {
  flowId: string;
}

export const FrigadeFlow: FC<FrigadeFlowProps> = ({
                                                    flowId,
                                                    ...props
                                                  }) => {
  const {flow, error, mutate, isLoading} = useGetMyFlow(flowId);

  if (isLoading) {
    return null;
  }

  return (
    <OnboardFlow
      {...props}
      pages={JSON.parse(flow.data).data as PageData[]}
    />
  );
}