import { Flex, Popover, PopoverBody, PopoverContent, PopoverTrigger } from '@invoke-ai/ui-library';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import RgbColorPicker from 'common/components/RgbColorPicker';
import { rgbColorToString } from 'common/util/colorCodeTransformers';
import { stopPropagation } from 'common/util/stopPropagation';
import { useEntityIdentifierContext } from 'features/controlLayers/contexts/EntityIdentifierContext';
import { rgFillChanged } from 'features/controlLayers/store/canvasV2Slice';
import { selectRegionalGuidanceEntityOrThrow } from 'features/controlLayers/store/regionsReducers';
import { memo, useCallback } from 'react';
import type { RgbColor } from 'react-colorful';
import { useTranslation } from 'react-i18next';

export const RegionalGuidanceMaskFillColorPicker = memo(() => {
  const entityIdentifier = useEntityIdentifierContext();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const fill = useAppSelector((s) => selectRegionalGuidanceEntityOrThrow(s.canvasV2, entityIdentifier.id).fill);
  const onChange = useCallback(
    (fill: RgbColor) => {
      dispatch(rgFillChanged({ id: entityIdentifier.id, fill }));
    },
    [dispatch, entityIdentifier.id]
  );
  return (
    <Popover isLazy>
      <PopoverTrigger>
        <Flex
          as="button"
          aria-label={t('controlLayers.maskPreviewColor')}
          borderRadius="full"
          borderWidth={1}
          bg={rgbColorToString(fill)}
          w={8}
          h={8}
          cursor="pointer"
          tabIndex={-1}
          onDoubleClick={stopPropagation} // double click expands the layer
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody minH={64}>
          <RgbColorPicker color={fill} onChange={onChange} withNumberInput />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
});

RegionalGuidanceMaskFillColorPicker.displayName = 'RegionalGuidanceMaskFillColorPicker';
