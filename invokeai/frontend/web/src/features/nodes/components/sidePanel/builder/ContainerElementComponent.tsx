import { Flex, IconButton, type SystemStyleObject } from '@invoke-ai/ui-library';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import {
  ContainerContextProvider,
  DepthContextProvider,
  useDepthContext,
} from 'features/nodes/components/sidePanel/builder/contexts';
import { DividerElementComponent } from 'features/nodes/components/sidePanel/builder/DividerElementComponent';
import { FormElementEditModeWrapper } from 'features/nodes/components/sidePanel/builder/FormElementEditModeWrapper';
import { HeadingElementComponent } from 'features/nodes/components/sidePanel/builder/HeadingElementComponent';
import { NodeFieldElementComponent } from 'features/nodes/components/sidePanel/builder/NodeFieldElementComponent';
import { TextElementComponent } from 'features/nodes/components/sidePanel/builder/TextElementComponent';
import { formElementAdded, selectWorkflowFormMode, useElement } from 'features/nodes/store/workflowSlice';
import type { ContainerElement } from 'features/nodes/types/workflow';
import {
  buildContainer,
  CONTAINER_CLASS_NAME,
  isContainerElement,
  isDividerElement,
  isHeadingElement,
  isNodeFieldElement,
  isTextElement,
} from 'features/nodes/types/workflow';
import { memo, useCallback } from 'react';
import { PiPlusBold } from 'react-icons/pi';
import type { Equals } from 'tsafe';
import { assert } from 'tsafe';

const sx: SystemStyleObject = {
  gap: 4,
  flex: '1 1 0',
  '&[data-container-direction="column"]': {
    flexDir: 'column',
  },
  '&[data-container-direction="row"]': {
    flexDir: 'row',
  },
};

export const ContainerElementComponent = memo(({ id }: { id: string }) => {
  const el = useElement(id);
  const mode = useAppSelector(selectWorkflowFormMode);

  if (!el || !isContainerElement(el)) {
    return null;
  }

  if (mode === 'view') {
    return <ContainerElementComponentViewMode el={el} />;
  }

  // mode === 'edit'
  return <ContainerElementComponentEditMode el={el} />;
});
ContainerElementComponent.displayName = 'ContainerElementComponent';

export const ContainerElementComponentViewMode = memo(({ el }: { el: ContainerElement }) => {
  const depth = useDepthContext();
  const { id, data } = el;
  const { children, direction } = data;

  return (
    <DepthContextProvider depth={depth + 1}>
      <ContainerContextProvider id={id} direction={direction}>
        <Flex id={id} className={CONTAINER_CLASS_NAME} sx={sx} data-container-direction={direction}>
          {children.map((childId) => (
            <FormElementComponent key={childId} id={childId} />
          ))}
        </Flex>
      </ContainerContextProvider>
    </DepthContextProvider>
  );
});
ContainerElementComponentViewMode.displayName = 'ContainerElementComponentViewMode';

export const ContainerElementComponentEditMode = memo(({ el }: { el: ContainerElement }) => {
  const depth = useDepthContext();
  const { id, data } = el;
  const { children, direction } = data;

  return (
    <FormElementEditModeWrapper element={el}>
      <DepthContextProvider depth={depth + 1}>
        <ContainerContextProvider id={id} direction={direction}>
          <Flex id={id} className={CONTAINER_CLASS_NAME} sx={sx} data-container-direction={direction}>
            {children.map((childId) => (
              <FormElementComponent key={childId} id={childId} />
            ))}
            {direction === 'row' && children.length < 3 && depth < 2 && <AddColumnButton el={el} />}
            {direction === 'column' && depth < 1 && <AddRowButton el={el} />}
          </Flex>
        </ContainerContextProvider>
      </DepthContextProvider>
    </FormElementEditModeWrapper>
  );
});
ContainerElementComponentEditMode.displayName = 'ContainerElementComponentEditMode';

const AddColumnButton = ({ el }: { el: ContainerElement }) => {
  const dispatch = useAppDispatch();
  const onClick = useCallback(() => {
    const element = buildContainer('column', [], el.id);
    dispatch(formElementAdded({ element, containerId: el.id }));
  }, [dispatch, el.id]);
  return (
    <IconButton onClick={onClick} aria-label="add column" icon={<PiPlusBold />} h="unset" variant="ghost" size="sm" />
  );
};

const AddRowButton = ({ el }: { el: ContainerElement }) => {
  const dispatch = useAppDispatch();
  const onClick = useCallback(() => {
    const element = buildContainer('row', [], el.id);
    dispatch(formElementAdded({ element, containerId: el.id }));
  }, [dispatch, el.id]);
  return (
    <IconButton onClick={onClick} aria-label="add row" icon={<PiPlusBold />} w="unset" variant="ghost" size="sm" />
  );
};

// TODO(psyche): Can we move this into a separate file and avoid circular dependencies between it and ContainerElementComponent?
export const FormElementComponent = memo(({ id }: { id: string }) => {
  const el = useElement(id);

  if (!el) {
    return null;
  }

  if (isContainerElement(el)) {
    return <ContainerElementComponent key={id} id={id} />;
  }

  if (isNodeFieldElement(el)) {
    return <NodeFieldElementComponent key={id} id={id} />;
  }

  if (isDividerElement(el)) {
    return <DividerElementComponent key={id} id={id} />;
  }

  if (isHeadingElement(el)) {
    return <HeadingElementComponent key={id} id={id} />;
  }

  if (isTextElement(el)) {
    return <TextElementComponent key={id} id={id} />;
  }

  assert<Equals<typeof el, never>>(false, `Unhandled type for element with id ${id}`);
});
FormElementComponent.displayName = 'FormElementComponent';
