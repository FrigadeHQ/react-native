# @frigade/react-native

[![npm version](https://img.shields.io/npm/v/@frigade/react-native)](https://www.npmjs.com/package/@frigade/react-native)
[![npm version](https://img.shields.io/npm/dm/@frigade/react-native.svg)](https://www.npmjs.com/package/@frigade/react-native)
[![npm version](https://github.com/FrigadeHQ/@frigade/react-native/actions/workflows/tests.yml/badge.svg)](https://github.com/FrigadeHQ/@frigade/react-native/actions/workflows/tests.yml)
[![npm license](https://img.shields.io/npm/l/@frigade/react-native)](https://www.npmjs.com/package/@frigade/react-native)
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
If available, you can optionally set the identifier of the signed in user using the `userId` param. This will allow Frigade to track the user's across flows.

```jsx
import { FrigadeProvider } from '@frigade/react-native';

const App = () => {
  return (
    <FrigadeProvider publicApiKey='<MY_PUBLIC_API_KEY>' userId='<OPTIONAL_USER_ID>'>
      ...
    </FrigadeProvider>
  );
};
```


## Docs

The official docs are available at [docs.frigade.com](https://docs.frigade.com/).

## Get in touch

Questions? Comments? Suggestions? Join the [Frigade Discord](https://discord.gg/3fujYupY) or visit
the [Frigade](https://frigade.com) website.