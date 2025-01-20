import type { SystemStyleObject } from '@invoke-ai/ui-library';
import { Flex } from '@invoke-ai/ui-library';
import type { PropsWithChildren } from 'react';
import { memo } from 'react';

const sx = {
  position: 'relative',
  minH: 8,
  py: 0.5,
  alignItems: 'center',
  transitionProperty: 'opacity',
  transitionDuration: '0.1s',
  w: 'full',
  h: 'full',
  '&[data-should-dim="true"]': {
    opacity: 0.5,
  },
} satisfies SystemStyleObject;

type InputFieldWrapperProps = PropsWithChildren<{
  shouldDim: boolean;
}>;

export const InputFieldWrapper = memo(({ shouldDim, children }: InputFieldWrapperProps) => {
  return (
    <Flex sx={sx} data-should-dim={shouldDim}>
      {children}
    </Flex>
  );
});

InputFieldWrapper.displayName = 'InputFieldWrapper';
