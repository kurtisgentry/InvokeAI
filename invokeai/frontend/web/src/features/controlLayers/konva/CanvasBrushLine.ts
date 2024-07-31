import { rgbaColorToString } from 'common/util/colorCodeTransformers';
import { deepClone } from 'common/util/deepClone';
import type { CanvasLayer } from 'features/controlLayers/konva/CanvasLayer';
import { CanvasObject } from 'features/controlLayers/konva/CanvasObject';
import type { BrushLine } from 'features/controlLayers/store/types';
import Konva from 'konva';

export class CanvasBrushLine extends CanvasObject {
  static NAME_PREFIX = 'brush-line';
  static GROUP_NAME = `${CanvasBrushLine.NAME_PREFIX}_group`;
  static LINE_NAME = `${CanvasBrushLine.NAME_PREFIX}_line`;
  static TYPE = 'brush_line';

  state: BrushLine;
  konva: {
    group: Konva.Group;
    line: Konva.Line;
  };

  constructor(state: BrushLine, parent: CanvasLayer) {
    super(state.id, parent);
    this._log.trace({ state }, 'Creating brush line');

    const { strokeWidth, clip, color, points } = state;

    this.konva = {
      group: new Konva.Group({
        name: CanvasBrushLine.GROUP_NAME,
        clip,
        listening: false,
      }),
      line: new Konva.Line({
        name: CanvasBrushLine.LINE_NAME,
        listening: false,
        shadowForStrokeEnabled: false,
        strokeWidth,
        tension: 0,
        lineCap: 'round',
        lineJoin: 'round',
        globalCompositeOperation: 'source-over',
        stroke: rgbaColorToString(color),
        // A line with only one point will not be rendered, so we duplicate the points to make it visible
        points: points.length === 2 ? [...points, ...points] : points,
      }),
    };
    this.konva.group.add(this.konva.line);
    this.state = state;
  }

  update(state: BrushLine, force?: boolean): boolean {
    if (force || this.state !== state) {
      this._log.trace({ state }, 'Updating brush line');
      const { points, color, clip, strokeWidth } = state;
      this.konva.line.setAttrs({
        // A line with only one point will not be rendered, so we duplicate the points to make it visible
        points: points.length === 2 ? [...points, ...points] : points,
        stroke: rgbaColorToString(color),
        clip,
        strokeWidth,
      });
      this.state = state;
      return true;
    } else {
      return false;
    }
  }

  destroy() {
    this._log.trace('Destroying brush line');
    this.konva.group.destroy();
  }

  setVisibility(isVisible: boolean): void {
    this._log.trace({ isVisible }, 'Setting brush line visibility');
    this.konva.group.visible(isVisible);
  }

  repr() {
    return {
      id: this.id,
      type: CanvasBrushLine.TYPE,
      parent: this._parent.id,
      state: deepClone(this.state),
    };
  }
}
