import { useTranslation } from 'react-i18next';
import type { SessionQueueItemDTO } from 'services/api/types';

export const useOriginText = (origin: SessionQueueItemDTO['origin']) => {
  const { t } = useTranslation();

  if (origin === 'generation') {
    return t('queue.generation');
  }

  if (origin === 'workflows') {
    return t('queue.workflows');
  }

  return t('queue.other');
};
