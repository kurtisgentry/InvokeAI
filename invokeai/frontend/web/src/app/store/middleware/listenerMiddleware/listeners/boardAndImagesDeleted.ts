import type { AppStartListening } from 'app/store/middleware/listenerMiddleware';
import { getImageUsage } from 'features/deleteImageModal/store/selectors';
import { nodeEditorReset } from 'features/nodes/store/nodesSlice';
import { imagesApi } from 'services/api/endpoints/images';

export const addDeleteBoardAndImagesFulfilledListener = (startAppListening: AppStartListening) => {
  startAppListening({
    matcher: imagesApi.endpoints.deleteBoardAndImages.matchFulfilled,
    effect: (action, { dispatch, getState }) => {
      const { deleted_images } = action.payload;

      // Remove all deleted images from the UI

      let wasNodeEditorReset = false;

      const { nodes, canvasV2 } = getState();

      deleted_images.forEach((image_name) => {
        const imageUsage = getImageUsage(nodes.present, canvasV2, image_name);

        if (imageUsage.isNodesImage && !wasNodeEditorReset) {
          dispatch(nodeEditorReset());
          wasNodeEditorReset = true;
        }
      });
    },
  });
};
