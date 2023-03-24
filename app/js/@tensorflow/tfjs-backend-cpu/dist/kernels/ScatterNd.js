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
import { backend_util, ScatterNd } from '@tensorflow/tfjs-core';
import { scatterImpl } from './Scatter_impl';
export function scatterNd(args) {
    const { inputs, backend, attrs } = args;
    const { indices, updates } = inputs;
    const { shape } = attrs;
    const { sliceRank, numUpdates, sliceSize, strides, outputSize } = backend_util.calculateShapes(updates, indices, shape);
    const sumDupeIndices = true;
    const indicesBuf = backend.bufferSync(indices);
    const updatesBuf = backend.bufferSync(updates);
    const outBuf = scatterImpl(indicesBuf, updatesBuf, shape, outputSize, sliceSize, numUpdates, sliceRank, strides, 0 /* defaultValue */, sumDupeIndices);
    return backend.makeTensorInfo(shape, outBuf.dtype, outBuf.values);
}
export const scatterNdConfig = {
    kernelName: ScatterNd,
    backendName: 'cpu',
    kernelFunc: scatterNd
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2NhdHRlck5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLWNwdS9zcmMva2VybmVscy9TY2F0dGVyTmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBa0MsU0FBUyxFQUE4QyxNQUFNLHVCQUF1QixDQUFDO0FBRzNJLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUUzQyxNQUFNLFVBQVUsU0FBUyxDQUFDLElBSXpCO0lBQ0MsTUFBTSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3RDLE1BQU0sRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFDLEdBQUcsTUFBTSxDQUFDO0lBQ2xDLE1BQU0sRUFBQyxLQUFLLEVBQUMsR0FBRyxLQUFLLENBQUM7SUFFdEIsTUFBTSxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUMsR0FDekQsWUFBWSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzFELE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQztJQUU1QixNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFnQixPQUFPLENBQUMsQ0FBQztJQUM5RCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUEwQixPQUFPLENBQUMsQ0FBQztJQUV4RSxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQ3RCLFVBQVUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUNoRSxTQUFTLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUU5RCxPQUFPLE9BQU8sQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BFLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQWlCO0lBQzNDLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLFVBQVUsRUFBRSxTQUFrQztDQUMvQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2JhY2tlbmRfdXRpbCwgS2VybmVsQ29uZmlnLCBLZXJuZWxGdW5jLCBSYW5rLCBTY2F0dGVyTmQsIFNjYXR0ZXJOZEF0dHJzLCBTY2F0dGVyTmRJbnB1dHMsIFRlbnNvckluZm99IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7TWF0aEJhY2tlbmRDUFV9IGZyb20gJy4uL2JhY2tlbmRfY3B1JztcbmltcG9ydCB7c2NhdHRlckltcGx9IGZyb20gJy4vU2NhdHRlcl9pbXBsJztcblxuZXhwb3J0IGZ1bmN0aW9uIHNjYXR0ZXJOZChhcmdzOiB7XG4gIGlucHV0czogU2NhdHRlck5kSW5wdXRzLFxuICBiYWNrZW5kOiBNYXRoQmFja2VuZENQVSxcbiAgYXR0cnM6IFNjYXR0ZXJOZEF0dHJzXG59KTogVGVuc29ySW5mbyB7XG4gIGNvbnN0IHtpbnB1dHMsIGJhY2tlbmQsIGF0dHJzfSA9IGFyZ3M7XG4gIGNvbnN0IHtpbmRpY2VzLCB1cGRhdGVzfSA9IGlucHV0cztcbiAgY29uc3Qge3NoYXBlfSA9IGF0dHJzO1xuXG4gIGNvbnN0IHtzbGljZVJhbmssIG51bVVwZGF0ZXMsIHNsaWNlU2l6ZSwgc3RyaWRlcywgb3V0cHV0U2l6ZX0gPVxuICAgICAgYmFja2VuZF91dGlsLmNhbGN1bGF0ZVNoYXBlcyh1cGRhdGVzLCBpbmRpY2VzLCBzaGFwZSk7XG4gIGNvbnN0IHN1bUR1cGVJbmRpY2VzID0gdHJ1ZTtcblxuICBjb25zdCBpbmRpY2VzQnVmID0gYmFja2VuZC5idWZmZXJTeW5jPFJhbmssICdpbnQzMic+KGluZGljZXMpO1xuICBjb25zdCB1cGRhdGVzQnVmID0gYmFja2VuZC5idWZmZXJTeW5jPFJhbmssICdpbnQzMid8J2Zsb2F0MzInPih1cGRhdGVzKTtcblxuICBjb25zdCBvdXRCdWYgPSBzY2F0dGVySW1wbChcbiAgICAgIGluZGljZXNCdWYsIHVwZGF0ZXNCdWYsIHNoYXBlLCBvdXRwdXRTaXplLCBzbGljZVNpemUsIG51bVVwZGF0ZXMsXG4gICAgICBzbGljZVJhbmssIHN0cmlkZXMsIDAgLyogZGVmYXVsdFZhbHVlICovLCBzdW1EdXBlSW5kaWNlcyk7XG5cbiAgcmV0dXJuIGJhY2tlbmQubWFrZVRlbnNvckluZm8oc2hhcGUsIG91dEJ1Zi5kdHlwZSwgb3V0QnVmLnZhbHVlcyk7XG59XG5cbmV4cG9ydCBjb25zdCBzY2F0dGVyTmRDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogU2NhdHRlck5kLFxuICBiYWNrZW5kTmFtZTogJ2NwdScsXG4gIGtlcm5lbEZ1bmM6IHNjYXR0ZXJOZCBhcyB1bmtub3duIGFzIEtlcm5lbEZ1bmNcbn07XG4iXX0=