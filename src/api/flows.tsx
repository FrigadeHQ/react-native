import useSWR from 'swr'
import React, {useMemo} from "react";
import {FrigadeContext} from "../FrigadeProvider";
import {API_PREFIX} from "./common";

export interface Flow {
  id: number;
  name: string;
  description: string;
  data: any;
  createdAt: string;
  modifiedAt: string;
  slug: string;
}

const fetcher = async (url, config) => {
  let res;

  if (config) {
    res = await fetch(url, config);
  } else {
    res = await fetch(url);
  }

  return res.json();
};

export function useGetMyFlow(slug: string): { flow: Flow, mutate: () => void, error: boolean, isLoading: boolean } {
  // get apikey from context
  const { publicApiKey } = React.useContext(FrigadeContext);

  const config = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${publicApiKey}`,
        'Content-Type': 'application/json',
      },
    }),
    [publicApiKey]
  );

  const { data, error, mutate, isLoading } = useSWR([`${API_PREFIX}flows/${slug}`, config], fetcher);

  return {flow: data, error, mutate, isLoading};
}