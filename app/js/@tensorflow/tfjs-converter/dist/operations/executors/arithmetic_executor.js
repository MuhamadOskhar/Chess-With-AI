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
        case 'BiasAdd':
        case 'AddV2':
        case 'Add': {
            return [ops.add(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        case 'AddN': {
            return [ops.addN(getParamValue('tensors', node, tensorMap, context))];
        }
        case 'FloorMod':
        case 'Mod':
            return [ops.mod(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        case 'Mul':
            return [ops.mul(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        case 'RealDiv':
        case 'Div': {
            return [ops.div(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        case 'DivNoNan': {
            return [ops.divNoNan(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        case 'FloorDiv': {
            return [ops.floorDiv(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        case 'Sub': {
            return [ops.sub(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        case 'Minimum': {
            return [ops.minimum(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        case 'Maximum': {
            return [ops.maximum(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        case 'Pow': {
            return [ops.pow(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        case 'SquaredDifference': {
            return [ops.squaredDifference(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
        }
        default:
            throw TypeError(`Node type ${node.op} is not implemented`);
    }
};
export const CATEGORY = 'arithmetic';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJpdGhtZXRpY19leGVjdXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29udmVydGVyL3NyYy9vcGVyYXRpb25zL2V4ZWN1dG9ycy9hcml0aG1ldGljX2V4ZWN1dG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUdILGlEQUFpRDtBQUNqRCxPQUFPLEtBQUssS0FBSyxNQUFNLGtEQUFrRCxDQUFDO0FBTTFFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFFdEMsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUNsQixDQUFDLElBQVUsRUFBRSxTQUEwQixFQUN0QyxPQUF5QixFQUFFLEdBQUcsR0FBRyxLQUFLLEVBQVksRUFBRTtJQUNuRCxRQUFRLElBQUksQ0FBQyxFQUFFLEVBQUU7UUFDZixLQUFLLFNBQVMsQ0FBQztRQUNmLEtBQUssT0FBTyxDQUFDO1FBQ2IsS0FBSyxLQUFLLENBQUMsQ0FBQztZQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUNWLGFBQWEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQVksRUFDeEQsYUFBYSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBVyxDQUFDLENBQUMsQ0FBQztTQUM5RDtRQUNELEtBQUssTUFBTSxDQUFDLENBQUM7WUFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FDWixhQUFhLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFjLENBQUMsQ0FBQyxDQUFDO1NBQ3ZFO1FBQ0QsS0FBSyxVQUFVLENBQUM7UUFDaEIsS0FBSyxLQUFLO1lBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQ1gsYUFBYSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FB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SUFBSSxDQUFDLEVBQUUscUJBQXFCLENBQUMsQ0FBQztLQUM5RDtBQUNILENBQUMsQ0FBQztBQUVOLE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7VGVuc29yfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1pbXBvcnRzLWZyb20tZGlzdFxuaW1wb3J0ICogYXMgdGZPcHMgZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlL2Rpc3Qvb3BzL29wc19mb3JfY29udmVydGVyJztcblxuaW1wb3J0IHtOYW1lZFRlbnNvcnNNYXB9IGZyb20gJy4uLy4uL2RhdGEvdHlwZXMnO1xuaW1wb3J0IHtFeGVjdXRpb25Db250ZXh0fSBmcm9tICcuLi8uLi9leGVjdXRvci9leGVjdXRpb25fY29udGV4dCc7XG5pbXBvcnQge0ludGVybmFsT3BFeGVjdXRvciwgTm9kZX0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQge2dldFBhcmFtVmFsdWV9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgZXhlY3V0ZU9wOiBJbnRlcm5hbE9wRXhlY3V0b3IgPVxuICAgIChub2RlOiBOb2RlLCB0ZW5zb3JNYXA6IE5hbWVkVGVuc29yc01hcCxcbiAgICAgY29udGV4dDogRXhlY3V0aW9uQ29udGV4dCwgb3BzID0gdGZPcHMpOiBUZW5zb3JbXSA9PiB7XG4gICAgICBzd2l0Y2ggKG5vZGUub3ApIHtcbiAgICAgICAgY2FzZSAnQmlhc0FkZCc6XG4gICAgICAgIGNhc2UgJ0FkZFYyJzpcbiAgICAgICAgY2FzZSAnQWRkJzoge1xuICAgICAgICAgIHJldHVybiBbb3BzLmFkZChcbiAgICAgICAgICAgICAgKGdldFBhcmFtVmFsdWUoJ2EnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIFRlbnNvciksXG4gICAgICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ2InLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIFRlbnNvcildO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ0FkZE4nOiB7XG4gICAgICAgICAgcmV0dXJuIFtvcHMuYWRkTigoXG4gICAgICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ3RlbnNvcnMnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIFRlbnNvcltdKSldO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ0Zsb29yTW9kJzpcbiAgICAgICAgY2FzZSAnTW9kJzpcbiAgICAgICAgICByZXR1cm4gW29wcy5tb2QoXG4gICAgICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ2EnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIFRlbnNvcixcbiAgICAgICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgnYicsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yKV07XG4gICAgICAgIGNhc2UgJ011bCc6XG4gICAgICAgICAgcmV0dXJuIFtvcHMubXVsKFxuICAgICAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdhJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBUZW5zb3IsXG4gICAgICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ2InLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIFRlbnNvcildO1xuICAgICAgICBjYXNlICdSZWFsRGl2JzpcbiAgICAgICAgY2FzZSAnRGl2Jzoge1xuICAgICAgICAgIHJldHVybiBbb3BzLmRpdihcbiAgICAgICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgnYScsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yLFxuICAgICAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdiJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBUZW5zb3IpXTtcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdEaXZOb05hbic6IHtcbiAgICAgICAgICByZXR1cm4gW29wcy5kaXZOb05hbihcbiAgICAgICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgnYScsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yLFxuICAgICAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdiJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBUZW5zb3IpXTtcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdGbG9vckRpdic6IHtcbiAgICAgICAgICByZXR1cm4gW29wcy5mbG9vckRpdihcbiAgICAgICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgnYScsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yLFxuICAgICAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdiJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBUZW5zb3IpXTtcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdTdWInOiB7XG4gICAgICAgICAgcmV0dXJuIFtvcHMuc3ViKFxuICAgICAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdhJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBUZW5zb3IsXG4gICAgICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ2InLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIFRlbnNvcildO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ01pbmltdW0nOiB7XG4gICAgICAgICAgcmV0dXJuIFtvcHMubWluaW11bShcbiAgICAgICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgnYScsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yLFxuICAgICAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdiJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBUZW5zb3IpXTtcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdNYXhpbXVtJzoge1xuICAgICAgICAgIHJldHVybiBbb3BzLm1heGltdW0oXG4gICAgICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ2EnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIFRlbnNvcixcbiAgICAgICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgnYicsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yKV07XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAnUG93Jzoge1xuICAgICAgICAgIHJldHVybiBbb3BzLnBvdyhcbiAgICAgICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgnYScsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yLFxuICAgICAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdiJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBUZW5zb3IpXTtcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdTcXVhcmVkRGlmZmVyZW5jZSc6IHtcbiAgICAgICAgICByZXR1cm4gW29wcy5zcXVhcmVkRGlmZmVyZW5jZShcbiAgICAgICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgnYScsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yLFxuICAgICAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdiJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBUZW5zb3IpXTtcbiAgICAgICAgfVxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IFR5cGVFcnJvcihgTm9kZSB0eXBlICR7bm9kZS5vcH0gaXMgbm90IGltcGxlbWVudGVkYCk7XG4gICAgICB9XG4gICAgfTtcblxuZXhwb3J0IGNvbnN0IENBVEVHT1JZID0gJ2FyaXRobWV0aWMnO1xuIl19