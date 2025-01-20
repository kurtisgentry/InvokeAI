import { FormControl, FormLabel } from '@invoke-ai/ui-library';
import { InputFieldWrapper } from 'features/nodes/components/flow/nodes/Invocation/fields/InputFieldWrapper';
import { useFieldInputName } from 'features/nodes/hooks/useFieldInputName';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  nodeId: string;
  fieldName: string;
};

export const InputFieldUnknownPlaceholder = memo(({ nodeId, fieldName }: Props) => {
  const { t } = useTranslation();
  const name = useFieldInputName(nodeId, fieldName);

  return (
    <InputFieldWrapper shouldDim={false}>
      <FormControl isInvalid={true} alignItems="stretch" justifyContent="center" gap={2} h="full" w="full">
        <FormLabel display="flex" mb={0} px={1} py={2} gap={2}>
          {t('nodes.unknownInput', { name })}
        </FormLabel>
      </FormControl>
    </InputFieldWrapper>
  );
});

InputFieldUnknownPlaceholder.displayName = 'InputFieldUnknownPlaceholder';
