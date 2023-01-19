import React, {FC, useContext, useEffect} from "react";
import {useGetMyFlows} from "../api/flows";
import {FrigadeContext} from "../FrigadeProvider";


interface DataFetcherProps {

}

export const DataFetcher: FC<DataFetcherProps> = ({}) => {

  const {getFlows} = useGetMyFlows();
  const {setFlows} = useContext(FrigadeContext);

  async function prefetchFlows() {
    const flows = await getFlows();
    if (flows && flows?.data) {
      setFlows(flows.data);
    } else {
      console.error('Failed to prefetch flows');
    }
  }

  useEffect(() => {
    prefetchFlows();
  }, []);
  return <></>;
}
