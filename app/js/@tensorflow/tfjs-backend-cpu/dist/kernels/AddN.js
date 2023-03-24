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
import { AddN, buffer } from '@tensorflow/tfjs-core';
import { assertNotComplex } from '../cpu_util';
export function addN(args) {
    const { inputs, backend } = args;
    const tensors = inputs;
    assertNotComplex(inputs, 'addN');
    const vals = tensors.map(t => backend.data.get(t.dataId).values);
    const outBuf = buffer(tensors[0].shape, tensors[0].dtype);
    const outVals = outBuf.values;
    for (let i = 0; i < tensors.length; i++) {
        const currVals = vals[i];
        for (let j = 0; j < outVals.length; j++) {
            outVals[j] += currVals[j];
        }
    }
    return backend.makeTensorInfo(outBuf.shape, outBuf.dtype, outBuf.values);
}
export const addNConfig = {
    kernelName: AddN,
    backendName: 'cpu',
    kernelFunc: addN
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWRkTi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC1jcHUvc3JjL2tlcm5lbHMvQWRkTi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsSUFBSSxFQUFjLE1BQU0sRUFBMkQsTUFBTSx1QkFBdUIsQ0FBQztBQUd6SCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFN0MsTUFBTSxVQUFVLElBQUksQ0FBQyxJQUFtRDtJQUV0RSxNQUFNLEVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBQyxHQUFHLElBQUksQ0FBQztJQUMvQixNQUFNLE9BQU8sR0FBRyxNQUFrQixDQUFDO0lBRW5DLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUVqQyxNQUFNLElBQUksR0FDTixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQW9CLENBQUMsQ0FBQztJQUN0RSxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBa0IsQ0FBQyxDQUFDO0lBQ3ZFLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDOUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDdkMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3ZDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDM0I7S0FDRjtJQUVELE9BQU8sT0FBTyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNFLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQWlCO0lBQ3RDLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLFVBQVUsRUFBRSxJQUE2QjtDQUMxQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0FkZE4sIEFkZE5JbnB1dHMsIGJ1ZmZlciwgS2VybmVsQ29uZmlnLCBLZXJuZWxGdW5jLCBUZW5zb3IsIFRlbnNvckluZm8sIFR5cGVkQXJyYXl9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7TWF0aEJhY2tlbmRDUFV9IGZyb20gJy4uL2JhY2tlbmRfY3B1JztcbmltcG9ydCB7YXNzZXJ0Tm90Q29tcGxleH0gZnJvbSAnLi4vY3B1X3V0aWwnO1xuXG5leHBvcnQgZnVuY3Rpb24gYWRkTihhcmdzOiB7aW5wdXRzOiBBZGROSW5wdXRzLCBiYWNrZW5kOiBNYXRoQmFja2VuZENQVX0pOlxuICAgIFRlbnNvckluZm8ge1xuICBjb25zdCB7aW5wdXRzLCBiYWNrZW5kfSA9IGFyZ3M7XG4gIGNvbnN0IHRlbnNvcnMgPSBpbnB1dHMgYXMgVGVuc29yW107XG5cbiAgYXNzZXJ0Tm90Q29tcGxleChpbnB1dHMsICdhZGROJyk7XG5cbiAgY29uc3QgdmFscyA9XG4gICAgICB0ZW5zb3JzLm1hcCh0ID0+IGJhY2tlbmQuZGF0YS5nZXQodC5kYXRhSWQpLnZhbHVlcyBhcyBUeXBlZEFycmF5KTtcbiAgY29uc3Qgb3V0QnVmID0gYnVmZmVyKHRlbnNvcnNbMF0uc2hhcGUsIHRlbnNvcnNbMF0uZHR5cGUgYXMgJ2Zsb2F0MzInKTtcbiAgY29uc3Qgb3V0VmFscyA9IG91dEJ1Zi52YWx1ZXM7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGVuc29ycy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGN1cnJWYWxzID0gdmFsc1tpXTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG91dFZhbHMubGVuZ3RoOyBqKyspIHtcbiAgICAgIG91dFZhbHNbal0gKz0gY3VyclZhbHNbal07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJhY2tlbmQubWFrZVRlbnNvckluZm8ob3V0QnVmLnNoYXBlLCBvdXRCdWYuZHR5cGUsIG91dEJ1Zi52YWx1ZXMpO1xufVxuXG5leHBvcnQgY29uc3QgYWRkTkNvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBBZGROLFxuICBiYWNrZW5kTmFtZTogJ2NwdScsXG4gIGtlcm5lbEZ1bmM6IGFkZE4gYXMgdW5rbm93biBhcyBLZXJuZWxGdW5jXG59O1xuIl19