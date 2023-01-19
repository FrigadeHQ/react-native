import {FC, useEffect} from "react";
import {Flow, useGetMyFlows} from "../api/flows";
import {preload} from "swr";
import {API_PREFIX} from "../api/common";


interface DataFetcherProps {

}

export const DataFetcher: FC<DataFetcherProps> = ({}) => {

  const {getFlows} = useGetMyFlows();

  async function prefetchFlows() {
    const flows = await getFlows();
    if (flows && flows?.data) {
      flows.data.forEach((flow: Flow) => {
        preload(`${API_PREFIX}flows`, () => {
          return flow;
        });
      });
    } else {
      console.error('Failed to prefetch flows');
    }
  }

  useEffect(() => {
    prefetchFlows();
  }, []);
  return <></>;
}
