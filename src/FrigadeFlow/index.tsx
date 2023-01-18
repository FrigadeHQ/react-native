import React, {FC} from "react";
import {OnboardFlow, OnboardFlowProps, PageData, TextStyles} from "react-native-onboard";
import {useGetMyFlow} from "../api/flows";


interface FrigadeFlowProps extends OnboardFlowProps, TextStyles {
  flowId: string;
  customVariables?: object;
}

export const FrigadeFlow: FC<FrigadeFlowProps> = ({
                                                    flowId,
                                                    customVariables,
                                                    ...props
                                                  }) => {
  const {flow, error, mutate, isLoading} = useGetMyFlow(flowId);


  if (isLoading) {
    return null;
  }

  let rawData = flow.data;

  if (customVariables) {
    // Replace every ${variable} with the value of customVariables[variable] in rawData
    for (const [key, value] of Object.entries(customVariables)) {
      rawData = rawData.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value);
    }
  }

  return (
    <OnboardFlow
      {...props}
      pages={JSON.parse(rawData).data as PageData[]}
    />
  );
}
