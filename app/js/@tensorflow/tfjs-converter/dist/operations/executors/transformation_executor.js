/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
// tslint:disable-next-line: no-imports-from-dist
import * as tfOps from '@tensorflow/tfjs-core/dist/ops/ops_for_converter';
import { getParamValue } from './utils';
export const executeOp = (node, tensorMap, context, ops = tfOps) => {
    switch (node.op) {
        case 'Cast': {
            return [ops.cast(getParamValue('x', node, tensorMap, context), getParamValue('dtype', node, tensorMap, context))];
        }
        case 'ExpandDims': {
            const axis = getParamValue('axis', node, tensorMap, context);
            return [ops.expandDims(getParamValue('x', node, tensorMap, context), axis)];
        }
        case 'Squeeze': {
            const axis = getParamValue('axis', node, tensorMap, context);
            return [ops.squeeze(getParamValue('x', node, tensorMap, context), axis)];
        }
        case 'Reshape': {
            return [ops.reshape(getParamValue('x', node, tensorMap, context), getParamValue('shape', node, tensorMap, context))];
        }
        case 'MirrorPad': {
            return [ops.mirrorPad(getParamValue('x', node, tensorMap, context), getParamValue('padding', node, tensorMap, context), getParamValue('mode', node, tensorMap, context))];
        }
        case 'PadV2':
        case 'Pad': {
            return [ops.pad(getParamValue('x', node, tensorMap, context), getParamValue('padding', node, tensorMap, context), getParamValue('constantValue', node, tensorMap, context))];
        }
        case 'SpaceToBatchND': {
            const blockShape = getParamValue('blockShape', node, tensorMap, context);
            const paddings = getParamValue('paddings', node, tensorMap, context);
            return [ops.spaceToBatchND(getParamValue('x', node, tensorMap, context), blockShape, paddings)];
        }
        case 'BatchToSpaceND': {
            const blockShape = getParamValue('blockShape', node, tensorMap, context);
            const crops = getParamValue('crops', node, tensorMap, context);
            return [ops.batchToSpaceND(getParamValue('x', node, tensorMap, context), blockShape, crops)];
        }
        case 'DepthToSpace': {
            const blockSize = getParamValue('blockSize', node, tensorMap, context);
            const dataFormat = getParamValue('dataFormat', node, tensorMap, context).toUpperCase();
            return [ops.depthToSpace(getParamValue('x', node, tensorMap, context), blockSize, dataFormat)];
        }
        case 'BroadcastTo': {
            return [ops.broadcastTo(getParamValue('x', node, tensorMap, context), getParamValue('shape', node, tensorMap, context))];
        }
        case 'BroadcastArgs': {
            return [ops.broadcastArgs(getParamValue('s0', node, tensorMap, context), getParamValue('s1', node, tensorMap, context))];
        }
        default:
            throw TypeError(`Node type ${node.op} is not implemented`);
    }
};
export const CATEGORY = 'transformation';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtYXRpb25fZXhlY3V0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvbnZlcnRlci9zcmMvb3BlcmF0aW9ucy9leGVjdXRvcnMvdHJhbnNmb3JtYXRpb25fZXhlY3V0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBR0gsaURBQWlEO0FBQ2pELE9BQU8sS0FBSyxLQUFLLE1BQU0sa0RBQWtELENBQUM7QUFNMUUsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUV0QyxNQUFNLENBQUMsTUFBTSxTQUFTLEdBQ2xCLENBQUMsSUFBVSxFQUFFLFNBQTBCLEVBQ3RDLE9BQXlCLEVBQUUsR0FBRyxHQUFHLEtBQUssRUFBWSxFQUFFO0lBQ25ELFFBQVEsSUFBSSxDQUFDLEVBQUUsRUFBRTtRQUNmLEtBQUssTUFBTSxDQUFDLENBQUM7WUFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FDWixhQUFhLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFXLEVBQ3RELGFBQWEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQ3pCLENBQUMsQ0FBQyxDQUFDO1NBQzlCO1FBQ0QsS0FBSyxZQUFZLENBQUMsQ0FBQztZQUNqQixNQUFNLElBQUksR0FDTixhQUFhLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFXLENBQUM7WUFDOUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQ2xCLGFBQWEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ3BFO1FBQ0QsS0FBSyxTQUFTLENBQUMsQ0FBQztZQUNkLE1BQU0sSUFBSSxHQUNOLGFBQWEsQ0FBQyxNQUFNLEVB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LGFBQWEsQ0FBQyxDQUFDO1lBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUNuQixhQUFhLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFXLEVBQ3RELGFBQWEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQWEsQ0FBQyxDQUFDLENBQUM7U0FDcEU7UUFDRCxLQUFLLGVBQWUsQ0FBQyxDQUFDO1lBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUNyQixhQUFhLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFXLEVBQ3ZELGFBQWEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQVcsQ0FBQyxDQUFDLENBQUM7U0FDL0Q7UUFDRDtZQUNFLE1BQU0sU0FBUyxDQUFDLGFBQWEsSUFBSSxDQUFDLEVBQUUscUJBQXFCLENBQUMsQ0FBQztLQUM5RDtBQUNILENBQUMsQ0FBQztBQUVOLE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtUZW5zb3IsIFRlbnNvcjREfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1pbXBvcnRzLWZyb20tZGlzdFxuaW1wb3J0ICogYXMgdGZPcHMgZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlL2Rpc3Qvb3BzL29wc19mb3JfY29udmVydGVyJztcblxuaW1wb3J0IHtOYW1lZFRlbnNvcnNNYXB9IGZyb20gJy4uLy4uL2RhdGEvdHlwZXMnO1xuaW1wb3J0IHtFeGVjdXRpb25Db250ZXh0fSBmcm9tICcuLi8uLi9leGVjdXRvci9leGVjdXRpb25fY29udGV4dCc7XG5pbXBvcnQge0ludGVybmFsT3BFeGVjdXRvciwgTm9kZX0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQge2dldFBhcmFtVmFsdWV9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgZXhlY3V0ZU9wOiBJbnRlcm5hbE9wRXhlY3V0b3IgPVxuICAgIChub2RlOiBOb2RlLCB0ZW5zb3JNYXA6IE5hbWVkVGVuc29yc01hcCxcbiAgICAgY29udGV4dDogRXhlY3V0aW9uQ29udGV4dCwgb3BzID0gdGZPcHMpOiBUZW5zb3JbXSA9PiB7XG4gICAgICBzd2l0Y2ggKG5vZGUub3ApIHtcbiAgICAgICAgY2FzZSAnQ2FzdCc6IHtcbiAgICAgICAgICByZXR1cm4gW29wcy5jYXN0KFxuICAgICAgICAgICAgICBnZXRQYXJhbVZhbHVlKCd4Jywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBUZW5zb3IsXG4gICAgICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ2R0eXBlJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyAnaW50MzInIHxcbiAgICAgICAgICAgICAgICAgICdmbG9hdDMyJyB8ICdib29sJyldO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ0V4cGFuZERpbXMnOiB7XG4gICAgICAgICAgY29uc3QgYXhpcyA9XG4gICAgICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ2F4aXMnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIG51bWJlcjtcbiAgICAgICAgICByZXR1cm4gW29wcy5leHBhbmREaW1zKFxuICAgICAgICAgICAgICBnZXRQYXJhbVZhbHVlKCd4Jywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBUZW5zb3IsIGF4aXMpXTtcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdTcXVlZXplJzoge1xuICAgICAgICAgIGNvbnN0IGF4aXMgPVxuICAgICAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdheGlzJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBudW1iZXJbXTtcbiAgICAgICAgICByZXR1cm4gW29wcy5zcXVlZXplKFxuICAgICAgICAgICAgICBnZXRQYXJhbVZhbHVlKCd4Jywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBUZW5zb3IsIGF4aXMpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgJ1Jlc2hhcGUnOiB7XG4gICAgICAgICAgcmV0dXJuIFtvcHMucmVzaGFwZShcbiAgICAgICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgneCcsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yLFxuICAgICAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdzaGFwZScsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgbnVtYmVyW10pXTtcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdNaXJyb3JQYWQnOiB7XG4gICAgICAgICAgcmV0dXJuIFtvcHMubWlycm9yUGFkKFxuICAgICAgICAgICAgICBnZXRQYXJhbVZhbHVlKCd4Jywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBUZW5zb3IsXG4gICAgICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ3BhZGRpbmcnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzXG4gICAgICAgICAgICAgICAgICBBcnJheTxbbnVtYmVyLCBudW1iZXJdPixcbiAgICAgICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgnbW9kZScsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgJ3JlZmxlY3QnIHxcbiAgICAgICAgICAgICAgICAgICdzeW1tZXRyaWMnKV07XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAnUGFkVjInOlxuICAgICAgICBjYXNlICdQYWQnOiB7XG4gICAgICAgICAgcmV0dXJuIFtvcHMucGFkKFxuICAgICAgICAgICAgICBnZXRQYXJhbVZhbHVlKCd4Jywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBUZW5zb3IsXG4gICAgICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ3BhZGRpbmcnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzXG4gICAgICAgICAgICAgICAgICBBcnJheTxbbnVtYmVyLCBudW1iZXJdPixcbiAgICAgICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgnY29uc3RhbnRWYWx1ZScsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXNcbiAgICAgICAgICAgICAgICAgIG51bWJlcildO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ1NwYWNlVG9CYXRjaE5EJzoge1xuICAgICAgICAgIGNvbnN0IGJsb2NrU2hhcGUgPVxuICAgICAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdibG9ja1NoYXBlJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBudW1iZXJbXTtcbiAgICAgICAgICBjb25zdCBwYWRkaW5ncyA9XG4gICAgICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ3BhZGRpbmdzJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBudW1iZXJbXVtdO1xuICAgICAgICAgIHJldHVybiBbb3BzLnNwYWNlVG9CYXRjaE5EKFxuICAgICAgICAgICAgICBnZXRQYXJhbVZhbHVlKCd4Jywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBUZW5zb3IsXG4gICAgICAgICAgICAgIGJsb2NrU2hhcGUsIHBhZGRpbmdzKV07XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAnQmF0Y2hUb1NwYWNlTkQnOiB7XG4gICAgICAgICAgY29uc3QgYmxvY2tTaGFwZSA9XG4gICAgICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ2Jsb2NrU2hhcGUnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIG51bWJlcltdO1xuICAgICAgICAgIGNvbnN0IGNyb3BzID1cbiAgICAgICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgnY3JvcHMnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIG51bWJlcltdW107XG4gICAgICAgICAgcmV0dXJuIFtvcHMuYmF0Y2hUb1NwYWNlTkQoXG4gICAgICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ3gnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIFRlbnNvcixcbiAgICAgICAgICAgICAgYmxvY2tTaGFwZSwgY3JvcHMpXTtcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdEZXB0aFRvU3BhY2UnOiB7XG4gICAgICAgICAgY29uc3QgYmxvY2tTaXplID1cbiAgICAgICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgnYmxvY2tTaXplJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBudW1iZXI7XG4gICAgICAgICAgY29uc3QgZGF0YUZvcm1hdCA9XG4gICAgICAgICAgICAgIChnZXRQYXJhbVZhbHVlKCdkYXRhRm9ybWF0Jywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhc1xuICAgICAgICAgICAgICAgc3RyaW5nKS50b1VwcGVyQ2FzZSgpIGFzICdOSFdDJyB8XG4gICAgICAgICAgICAgICdOQ0hXJztcbiAgICAgICAgICByZXR1cm4gW29wcy5kZXB0aFRvU3BhY2UoXG4gICAgICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ3gnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIFRlbnNvcjRELFxuICAgICAgICAgICAgICBibG9ja1NpemUsIGRhdGFGb3JtYXQpXTtcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdCcm9hZGNhc3RUbyc6IHtcbiAgICAgICAgICByZXR1cm4gW29wcy5icm9hZGNhc3RUbyhcbiAgICAgICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgneCcsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yLFxuICAgICAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdzaGFwZScsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgbnVtYmVyW10pXTtcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdCcm9hZGNhc3RBcmdzJzoge1xuICAgICAgICAgIHJldHVybiBbb3BzLmJyb2FkY2FzdEFyZ3MoXG4gICAgICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ3MwJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBUZW5zb3IsXG4gICAgICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ3MxJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBUZW5zb3IpXTtcbiAgICAgICAgfVxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IFR5cGVFcnJvcihgTm9kZSB0eXBlICR7bm9kZS5vcH0gaXMgbm90IGltcGxlbWVudGVkYCk7XG4gICAgICB9XG4gICAgfTtcblxuZXhwb3J0IGNvbnN0IENBVEVHT1JZID0gJ3RyYW5zZm9ybWF0aW9uJztcbiJdfQ==