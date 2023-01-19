import React, {FC} from "react";
import {OnboardFlow, OnboardFlowProps, PageData, TextStyles} from "react-native-onboard";
import {useGetMyFlow} from "../api/flows";
import {useFrigadeClient} from "../FrigadeClient";


interface FrigadeFlowProps extends OnboardFlowProps, TextStyles {
  flowId: string;
}

export const FrigadeFlow: FC<FrigadeFlowProps> = ({
                                                    flowId,
                                                    customVariables,
                                                    ...props
                                                  }) => {
  const {flow, error, mutate, isLoading} = useGetMyFlow(flowId);
  const {userId} = useFrigadeClient();


  if (isLoading) {
    return null;
  }

  if (error || !flow) {
    console.error('Failed to load Frigade flow with id', flowId);
    return null;
  }

  let rawData = flow.data;

  if (customVariables) {
    // Replace every ${variable} with the value of customVariables[variable] in rawData
    for (const [key, value] of Object.entries(customVariables)) {
      const escapedValue = value.replace(/"/g, '\\"');
      rawData = rawData.replaceAll(new RegExp(`\\$\\{${key}\\}`, 'g'), escapedValue);
    }
  }

  return (
    <OnboardFlow
      {...props}
      pages={JSON.parse(rawData).data as PageData[]}
    />
  );
}
