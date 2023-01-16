import React from 'react';
import {FrigadeProvider, OnboardFlow} from '../index';

describe('Frigade Provider test suite', () => {
  it('component exist', () => {
    const component = (
      <FrigadeProvider publicApiKey={'test'}>
      </FrigadeProvider>
    );

    expect(component).toBeDefined();
  });
});
