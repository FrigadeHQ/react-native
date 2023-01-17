import React, {FC, useEffect} from "react";
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

  return (
    <OnboardFlow
      {...props}
      pages={JSON.parse(flow.data) as PageData[]}
    />
  );
}