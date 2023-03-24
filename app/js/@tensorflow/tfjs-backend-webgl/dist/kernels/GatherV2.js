/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
import { backend_util, GatherV2, util, env } from '@tensorflow/tfjs-core';
import { GatherProgram } from '../gather_gpu';
import { gatherV2ImplCPU } from '../kernel_utils/shared';
import { reshape } from './Reshape';
export function gatherV2(args) {
    const { inputs, backend, attrs } = args;
    const { x, indices } = inputs;
    const { axis, batchDims } = attrs;
    const parsedAxis = util.parseAxisParam(axis, x.shape)[0];
    if (env().get('DEBUG')) {
        // In debug mode, throw error when any index is out of bound.
        // Otherwise, just fill out of bounds with zeroes.
        const indicesVals = backend.readSync(indices.dataId);
        const axisDim = x.shape[parsedAxis];
        for (let i = 0; i < indicesVals.length; ++i) {
            const index = indicesVals[i];
            util.assert(index <= axisDim - 1 && index >= 0, () => `GatherV2: the index value ${index} is not in [0, ${axisDim - 1}]`);
        }
    }
    const shapeInfo = backend_util.segment_util.collectGatherOpShapeInfo(x, indices, parsedAxis, batchDims);
    const indicesSize = util.sizeFromShape(indices.shape);
    const toDispose = [];
    const flattenX = reshape({
        inputs: { x },
        backend,
        attrs: {
            shape: [
                shapeInfo.batchSize, shapeInfo.outerSize, shapeInfo.dimSize,
                shapeInfo.sliceSize
            ]
        }
    });
    const flattenIndex = reshape({
        inputs: { x: indices },
        backend,
        attrs: { shape: [shapeInfo.batchSize, indicesSize / shapeInfo.batchSize] }
    });
    toDispose.push(flattenX);
    toDispose.push(flattenIndex);
    const flattenOutputShape = [
        shapeInfo.batchSize, shapeInfo.outerSize, indicesSize / shapeInfo.batchSize,
        shapeInfo.sliceSize
    ];
    if (backend.shouldExecuteOnCPU([x, indices]) || x.dtype === 'string') {
        const indicesBuf = backend.bufferSync(flattenIndex);
        const xBuf = backend.bufferSync(flattenX);
        const outBuf = gatherV2ImplCPU(xBuf, indicesBuf, flattenOutputShape);
        toDispose.forEach(t => backend.disposeIntermediateTensorInfo(t));
        return backend.makeTensorInfo(shapeInfo.outputShape, outBuf.dtype, outBuf.values);
    }
    const program = new GatherProgram(flattenX.shape, flattenOutputShape);
    const res = backend.runWebGLProgram(program, [flattenX, flattenIndex], flattenX.dtype);
    toDispose.push(res);
    const reshaped = reshape({ inputs: { x: res }, backend, attrs: { shape: shapeInfo.outputShape } });
    toDispose.forEach(t => backend.disposeIntermediateTensorInfo(t));
    return reshaped;
}
export const gatherV2Config = {
    kernelName: GatherV2,
    backendName: 'webgl',
    kernelFunc: gatherV2
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2F0aGVyVjIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2tlcm5lbHMvR2F0aGVyVjIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBRSxRQUFRLEVBQW1GLElBQUksRUFBRSxHQUFHLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUd6SixPQUFPLEVBQUMsYUFBYSxFQUFjLE1BQU0sZUFBZSxDQUFDO0FBQ3pELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUV2RCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBRWxDLE1BQU0sVUFBVSxRQUFRLENBQUMsSUFJeEI7SUFDQyxNQUFNLEVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUMsR0FBRyxJQUFJLENBQUM7SUFDdEMsTUFBTSxFQUFDLENBQUMsRUFBRSxPQUFPLEVBQUMsR0FBRyxNQUFNLENBQUM7SUFDNUIsTUFBTSxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUMsR0FBRyxLQUFLLENBQUM7SUFFaEMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pELElBQUksR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ3RCLDZEQUE2RDtRQUM3RCxrREFBa0Q7UUFDbEQsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFlLENBQUM7UUFDbkUsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNwQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcs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RSxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxXQUFXLEVBQUMsRUFBQyxDQUFDLENBQUM7SUFDeEUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pFLE9BQU8sUUFBUSxDQUFDO0FBQ2xCLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxjQUFjLEdBQWlCO0lBQzFDLFVBQVUsRUFBRSxRQUFRO0lBQ3BCLFdBQVcsRUFBRSxPQUFPO0lBQ3BCLFVBQVUsRUFBRSxRQUFpQztDQUM5QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2JhY2tlbmRfdXRpbCwgR2F0aGVyVjIsIEdhdGhlclYyQXR0cnMsIEdhdGhlclYySW5wdXRzLCBLZXJuZWxDb25maWcsIEtlcm5lbEZ1bmMsIFRlbnNvckluZm8sIFR5cGVkQXJyYXksIHV0aWwsIGVudn0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtNYXRoQmFja2VuZFdlYkdMfSBmcm9tICcuLi9iYWNrZW5kX3dlYmdsJztcbmltcG9ydCB7R2F0aGVyUHJvZ3JhbSwgR2F0aGVyU2hhcGV9IGZyb20gJy4uL2dhdGhlcl9ncHUnO1xuaW1wb3J0IHtnYXRoZXJWMkltcGxDUFV9IGZyb20gJy4uL2tlcm5lbF91dGlscy9zaGFyZWQnO1xuXG5pbXBvcnQge3Jlc2hhcGV9IGZyb20gJy4vUmVzaGFwZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnYXRoZXJWMihhcmdzOiB7XG4gIGlucHV0czogR2F0aGVyVjJJbnB1dHMsXG4gIGJhY2tlbmQ6IE1hdGhCYWNrZW5kV2ViR0wsXG4gIGF0dHJzOiBHYXRoZXJWMkF0dHJzXG59KTogVGVuc29ySW5mbyB7XG4gIGNvbnN0IHtpbnB1dHMsIGJhY2tlbmQsIGF0dHJzfSA9IGFyZ3M7XG4gIGNvbnN0IHt4LCBpbmRpY2VzfSA9IGlucHV0cztcbiAgY29uc3Qge2F4aXMsIGJhdGNoRGltc30gPSBhdHRycztcblxuICBjb25zdCBwYXJzZWRBeGlzID0gdXRpbC5wYXJzZUF4aXNQYXJhbShheGlzLCB4LnNoYXBlKVswXTtcbiAgaWYgKGVudigpLmdldCgnREVCVUcnKSkge1xuICAgIC8vIEluIGRlYnVnIG1vZGUsIHRocm93IGVycm9yIHdoZW4gYW55IGluZGV4IGlzIG91dCBvZiBib3VuZC5cbiAgICAvLyBPdGhlcndpc2UsIGp1c3QgZmlsbCBvdXQgb2YgYm91bmRzIHdpdGggemVyb2VzLlxuICAgIGNvbnN0IGluZGljZXNWYWxzID0gYmFja2VuZC5yZWFkU3luYyhpbmRpY2VzLmRhdGFJZCkgYXMgVHlwZWRBcnJheTtcbiAgICBjb25zdCBheGlzRGltID0geC5zaGFwZVtwYXJzZWRBeGlzXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluZGljZXNWYWxzLmxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGluZGljZXNWYWxzW2ldO1xuICAgICAgdXRpbC5hc3NlcnQoXG4gICAgICAgIGluZGV4IDw9IGF4aXNEaW0gLSAxICYmIGluZGV4ID49IDAsXG4gICAgICAgICgpID0+XG4gICAgICAgICAgYEdhdGhlclYyOiB0aGUgaW5kZXggdmFsdWUgJHtpbmRleH0gaXMgbm90IGluIFswLCAke2F4aXNEaW0gLSAxfV1gKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBzaGFwZUluZm8gPSBiYWNrZW5kX3V0aWwuc2VnbWVudF91dGlsLmNvbGxlY3RHYXRoZXJPcFNoYXBlSW5mbyhcbiAgICAgIHgsIGluZGljZXMsIHBhcnNlZEF4aXMsIGJhdGNoRGltcyk7XG5cbiAgY29uc3QgaW5kaWNlc1NpemUgPSB1dGlsLnNpemVGcm9tU2hhcGUoaW5kaWNlcy5zaGFwZSk7XG5cbiAgY29uc3QgdG9EaXNwb3NlID0gW107XG5cbiAgY29uc3QgZmxhdHRlblggPSByZXNoYXBlKHtcbiAgICBpbnB1dHM6IHt4fSxcbiAgICBiYWNrZW5kLFxuICAgIGF0dHJzOiB7XG4gICAgICBzaGFwZTogW1xuICAgICAgICBzaGFwZUluZm8uYmF0Y2hTaXplLCBzaGFwZUluZm8ub3V0ZXJTaXplLCBzaGFwZUluZm8uZGltU2l6ZSxcbiAgICAgICAgc2hhcGVJbmZvLnNsaWNlU2l6ZVxuICAgICAgXVxuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgZmxhdHRlbkluZGV4ID0gcmVzaGFwZSh7XG4gICAgaW5wdXRzOiB7eDogaW5kaWNlc30sXG4gICAgYmFja2VuZCxcbiAgICBhdHRyczoge3NoYXBlOiBbc2hhcGVJbmZvLmJhdGNoU2l6ZSwgaW5kaWNlc1NpemUgLyBzaGFwZUluZm8uYmF0Y2hTaXplXX1cbiAgfSk7XG5cbiAgdG9EaXNwb3NlLnB1c2goZmxhdHRlblgpO1xuICB0b0Rpc3Bvc2UucHVzaChmbGF0dGVuSW5kZXgpO1xuXG4gIGNvbnN0IGZsYXR0ZW5PdXRwdXRTaGFwZSA9IFtcbiAgICBzaGFwZUluZm8uYmF0Y2hTaXplLCBzaGFwZUluZm8ub3V0ZXJTaXplLCBpbmRpY2VzU2l6ZSAvIHNoYXBlSW5mby5iYXRjaFNpemUsXG4gICAgc2hhcGVJbmZvLnNsaWNlU2l6ZVxuICBdO1xuXG4gIGlmIChiYWNrZW5kLnNob3VsZEV4ZWN1dGVPbkNQVShbeCwgaW5kaWNlc10pIHx8IHguZHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uc3QgaW5kaWNlc0J1ZiA9IGJhY2tlbmQuYnVmZmVyU3luYyhmbGF0dGVuSW5kZXgpO1xuICAgIGNvbnN0IHhCdWYgPSBiYWNrZW5kLmJ1ZmZlclN5bmMoZmxhdHRlblgpO1xuICAgIGNvbnN0IG91dEJ1ZiA9IGdhdGhlclYySW1wbENQVSh4QnVmLCBpbmRpY2VzQnVmLCBmbGF0dGVuT3V0cHV0U2hhcGUpO1xuXG4gICAgdG9EaXNwb3NlLmZvckVhY2godCA9PiBiYWNrZW5kLmRpc3Bvc2VJbnRlcm1lZGlhdGVUZW5zb3JJbmZvKHQpKTtcblxuICAgIHJldHVybiBiYWNrZW5kLm1ha2VUZW5zb3JJbmZvKFxuICAgICAgICBzaGFwZUluZm8ub3V0cHV0U2hhcGUsIG91dEJ1Zi5kdHlwZSwgb3V0QnVmLnZhbHVlcyBhcyBUeXBlZEFycmF5KTtcbiAgfVxuXG4gIGNvbnN0IHByb2dyYW0gPSBuZXcgR2F0aGVyUHJvZ3JhbShmbGF0dGVuWC5zaGFwZSBhcyBHYXRoZXJTaGFwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsYXR0ZW5PdXRwdXRTaGFwZSBhcyBHYXRoZXJTaGFwZSk7XG4gIGNvbnN0IHJlcyA9IGJhY2tlbmQucnVuV2ViR0xQcm9ncmFtKFxuICAgICAgcHJvZ3JhbSwgW2ZsYXR0ZW5YLCBmbGF0dGVuSW5kZXhdLCBmbGF0dGVuWC5kdHlwZSk7XG4gIHRvRGlzcG9zZS5wdXNoKHJlcyk7XG5cbiAgY29uc3QgcmVzaGFwZWQgPSByZXNoYXBlKFxuICAgICAge2lucHV0czoge3g6IHJlc30sIGJhY2tlbmQsIGF0dHJzOiB7c2hhcGU6IHNoYXBlSW5mby5vdXRwdXRTaGFwZX19KTtcbiAgdG9EaXNwb3NlLmZvckVhY2godCA9PiBiYWNrZW5kLmRpc3Bvc2VJbnRlcm1lZGlhdGVUZW5zb3JJbmZvKHQpKTtcbiAgcmV0dXJuIHJlc2hhcGVkO1xufVxuXG5leHBvcnQgY29uc3QgZ2F0aGVyVjJDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogR2F0aGVyVjIsXG4gIGJhY2tlbmROYW1lOiAnd2ViZ2wnLFxuICBrZXJuZWxGdW5jOiBnYXRoZXJWMiBhcyB1bmtub3duIGFzIEtlcm5lbEZ1bmNcbn07XG4iXX0=