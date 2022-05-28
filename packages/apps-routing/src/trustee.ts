// Copyright 2017-2022 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

// @ts-ignore
import Component from "../../page-trust/src/index";

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: []
    },
    group: 'developer',
    name: 'trustee',    icon: 'building-columns',

    text: t('trustee', 'trustee', { ns: 'apps-routing' })
  };
}
