import React, {useContext} from "react";
import {API_PREFIX, PaginatedResult, useConfig} from "./common";
import {FrigadeContext} from "../FrigadeProvider";

export interface Flow {
  id: number;
  name: string;
  description: string;
  data: string;
  createdAt: string;
  modifiedAt: string;
  slug: string;
}

export function useGetMyFlow(slug: string): { flow?: Flow } {
  const {flows} = useContext(FrigadeContext);

  // Find the flow with the same slug in the flows array
  const flow = flows.find(f => f.slug === slug);
  return {flow: flow}
}

export function useGetMyFlows(): { getFlows: () => Promise<PaginatedResult<Flow>> } {
  const {config} = useConfig();

  function getFlows() {
    return fetch(`${API_PREFIX}flows`, config).then(r => r.json())
  }

  return {getFlows};
}
