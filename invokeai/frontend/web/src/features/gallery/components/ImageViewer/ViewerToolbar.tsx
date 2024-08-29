import { Flex } from '@invoke-ai/ui-library';
import { createSelector } from '@reduxjs/toolkit';
import { useAppSelector } from 'app/store/storeHooks';
import { ToggleMetadataViewerButton } from 'features/gallery/components/ImageViewer/ToggleMetadataViewerButton';
import { ToggleProgressButton } from 'features/gallery/components/ImageViewer/ToggleProgressButton';
import { selectActiveTab } from 'features/ui/store/uiSelectors';
import { memo } from 'react';

import CurrentImageButtons from './CurrentImageButtons';
import { ViewerToggle } from './ViewerToggleMenu';

const selectShowToggle = createSelector(selectActiveTab, (tab) => {
  if (tab === 'upscaling' || tab === 'workflows') {
    return false;
  }
  return true;
});

export const ViewerToolbar = memo(() => {
  const showToggle = useAppSelector(selectShowToggle);
  return (
    <Flex w="full" gap={2}>
      <Flex flex={1} justifyContent="center">
        <Flex gap={2} marginInlineEnd="auto">
          <ToggleProgressButton />
          <ToggleMetadataViewerButton />
        </Flex>
      </Flex>
      <Flex flex={1} gap={2} justifyContent="center">
        <CurrentImageButtons />
      </Flex>
      <Flex flex={1} justifyContent="center">
        <Flex gap={2} marginInlineStart="auto">
          {showToggle && <ViewerToggle />}
        </Flex>
      </Flex>
    </Flex>
  );
});

ViewerToolbar.displayName = 'ViewerToolbar';
