// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {   Modal } from '@polkadot/react-components';
import General from './General';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  onClose: () => void;
}

function NetworkModal ({ className, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Modal
      className={className}
      header={t('Select Network')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        {/*//选择节点地方*/}
        <General
          isModalContent
          onClose={onClose}
        />
      </Modal.Content>
    </Modal>
  );
}

export default React.memo(NetworkModal);
