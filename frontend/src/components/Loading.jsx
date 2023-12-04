import React from 'react';
import { Alert, Flex, Spin } from 'antd';

const Loading = ({ action, waitTime }) => (
  <div className="absolute z-10 inset-0 flex items-center justify-center">
    <Flex gap="large" vertical>
      <Spin tip="Loading..." size='large'>
        <Alert
            message={`${action}`}
            description={`Perhaps waiting for ${waitTime} minutes...`}
            type="info"
        />
      </Spin>
    </Flex>
  </div>
);

export default Loading;
