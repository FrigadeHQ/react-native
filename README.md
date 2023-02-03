# @frigade/react-native

[![npm version](https://img.shields.io/npm/v/@frigade/react-native)](https://www.npmjs.com/package/@frigade/react-native)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

The official React Native SDK for [Frigade](https://frigade.com).

## Installation

Install the package with either npm or yarn:

```bash
npm install @frigade/react-native
```

or

```bash
yarn add @frigade/react-native
```

## Quick start

Place the `FrigadeProvider` at the root level of your app. This will provide the context for the `Frigade` component.
If available, you can optionally set the identifier of the signed in user using the `userId` param. This will allow
Frigade to track the user's across flows.

```jsx
import {FrigadeProvider} from '@frigade/react-native';

const App = () => {
  return (
    <FrigadeProvider publicApiKey='<MY_PUBLIC_API_KEY>'
                     userId='<OPTIONAL_USER_ID>'>
      ...
    </FrigadeProvider>
  );
};
```

With the `FrigadeProvider` in place, you can now use the `FrigadeFlow` component to render a flow. Make sure to pass
the `flowId` of the flow you want to render (copied from the Frigade dashboard).

```jsx
import {FrigadeFlow} from '@frigade/react-native';

const App = () => {
  return (
    <FrigadeFlow flowId='flow_6EoJIzZlOmCACn'/>
  );
};
```

## Docs

The official docs are available at [docs.frigade.com](https://docs.frigade.com/).

## Get in touch

Questions? Comments? Suggestions? Join the [Frigade Discord](https://discord.gg/yaRVEZMww5) or visit
the [Frigade](https://frigade.com) website.
