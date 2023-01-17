import {FC, useContext} from "react";
import {OnboardFlow, OnboardFlowProps, PageData, TextStyles} from "react-native-onboard";
import FrigadeContext from "../FrigadeProvider";
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
      pages={flow.data.data as PageData[]}
    />
  );

}