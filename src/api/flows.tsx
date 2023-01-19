import useSWR from 'swr'
import React from "react";
import {API_PREFIX, PaginatedResult, useConfig} from "./common";

export interface Flow {
  id: number;
  name: string;
  description: string;
  data: string;
  createdAt: string;
  modifiedAt: string;
  slug: string;
}

export function useGetMyFlow(slug: string): { flow: Flow, mutate: () => void, error: boolean, isLoading: boolean } {
  const {config} = useConfig();

  const {data, error, mutate, isLoading} = useSWR(`${API_PREFIX}flows/${slug}`,
    (apiURL: string) => {
      return fetch(apiURL, config).then(r => r.json())
    });

  return {flow: data, error, mutate, isLoading};
}

export function useGetMyFlows(): { getFlows: () => Promise<PaginatedResult<Flow>> } {
  const {config} = useConfig();

  function getFlows() {
    return fetch(`${API_PREFIX}flows`, config).then(r => r.json())
  }

  return {getFlows};
}
