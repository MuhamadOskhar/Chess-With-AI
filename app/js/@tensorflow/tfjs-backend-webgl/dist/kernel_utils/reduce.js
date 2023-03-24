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
import { backend_util } from '@tensorflow/tfjs-core';
import { MeanProgram } from '../mean_gpu';
import { ReduceProgram } from '../reduce_gpu';
// Returns an array of configuration objects that describe each stage of the
// reduction.
function getReductionStages(inShape) {
    const stages = [];
    while (stages.length === 0 || stages[stages.length - 1].outSize !== 1) {
        const outSize = stages.length ? stages[stages.length - 1].outSize : inShape[1];
        const windowSize = backend_util.computeOptimalWindowSize(outSize);
        stages.push({
            inSize: outSize,
            windowSize,
            outSize: Math.ceil(outSize / windowSize)
        });
    }
    return stages;
}
export function reduce(x, dtype, reductionType, backend) {
    const reductionStages = getReductionStages(x.shape);
    let result = x;
    for (let i = 0; i < reductionStages.length; i++) {
        const { inSize, windowSize, outSize } = reductionStages[i];
        let program;
        let previousResult;
        if (reductionType === 'mean') {
            program = i === 0 ?
                new MeanProgram({ windowSize, inSize, batchSize: x.shape[0], outSize }, inSize) :
                new MeanProgram({ windowSize, inSize, batchSize: x.shape[0], outSize });
        }
        else {
            program = new ReduceProgram({ windowSize, inSize, batchSize: x.shape[0], outSize }, reductionType);
        }
        previousResult = result;
        result = backend.runWebGLProgram(program, [result], dtype);
        if (previousResult.dataId !== x.dataId) {
            backend.disposeIntermediateTensorInfo(previousResult);
        }
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkdWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9rZXJuZWxfdXRpbHMvcmVkdWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQXVCLE1BQU0sdUJBQXVCLENBQUM7QUFHekUsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN4QyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBSTVDLDRFQUE0RTtBQUM1RSxhQUFhO0FBQ2IsU0FBUyxrQkFBa0IsQ0FBQyxPQUFpQjtJQUUzQyxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFFbEIsT0FBTyxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLEtBQUssQ0FBQyxFQUFFO1FBQ3JFLE1BQU0sT0FBTyxHQUNULE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25FLE1BQU0sVUFBVSxHQUFHLFlBQVksQ0FBQyx3QkFBd0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsRSxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ1YsTUFBTSxFQUFFLE9BQU87WUFDZixVQUFVO1lBQ1YsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQztTQUN6QyxDQUFDLENBQUM7S0FDSjtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFFRCxNQUFNLFVBQVUsTUFBTSxDQUNsQixDQUFhLEVBQUUsS0FBZSxFQUFFLGFBQTBCLEVBQzFELE9BQXlCO0lBQzNCLE1BQU0sZUFBZSxHQUFHLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVwRCxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDZixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMvQyxNQUFNLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFekQsSUFBSSxPQUFrQyxDQUFDO1FBQ3ZDLElBQUksY0FBMEIsQ0FBQztRQUMvQixJQUFJLGFBQWEsS0FBSyxNQUFNLEVBQUU7WUFDNUIsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDZixJQUFJLFdBQVcsQ0FDWCxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDbkUsSUFBSSxXQUFXLENBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7U0FDM0U7YUFBTTtZQUNMLE9BQU8sR0FBRyxJQUFJLGFBQWEsQ0FDdkIsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1NBQzFFO1FBRUQsY0FBYyxHQUFHLE1BQU0sQ0FBQztRQUN4QixNQUFNLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUUzRCxJQUFJLGNBQWMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRTtZQUN0QyxPQUFPLENBQUMsNkJBQTZCLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDdkQ7S0FDRjtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7YmFja2VuZF91dGlsLCBEYXRhVHlwZSwgVGVuc29ySW5mb30gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtNYXRoQmFja2VuZFdlYkdMfSBmcm9tICcuLi9iYWNrZW5kX3dlYmdsJztcbmltcG9ydCB7TWVhblByb2dyYW19IGZyb20gJy4uL21lYW5fZ3B1JztcbmltcG9ydCB7UmVkdWNlUHJvZ3JhbX0gZnJvbSAnLi4vcmVkdWNlX2dwdSc7XG5cbnR5cGUgUmVkdWNlVHlwZXMgPSAnYWxsJ3wnYW55J3wnbWF4J3wnbWluJ3wnc3VtJ3wncHJvZCd8J21lYW4nO1xuXG4vLyBSZXR1cm5zIGFuIGFycmF5IG9mIGNvbmZpZ3VyYXRpb24gb2JqZWN0cyB0aGF0IGRlc2NyaWJlIGVhY2ggc3RhZ2Ugb2YgdGhlXG4vLyByZWR1Y3Rpb24uXG5mdW5jdGlvbiBnZXRSZWR1Y3Rpb25TdGFnZXMoaW5TaGFwZTogbnVtYmVyW10pOlxuICAgIEFycmF5PHtpblNpemU6IG51bWJlciwgd2luZG93U2l6ZTogbnVtYmVyLCBvdXRTaXplOiBudW1iZXJ9PiB7XG4gIGNvbnN0IHN0YWdlcyA9IFtdO1xuXG4gIHdoaWxlIChzdGFnZXMubGVuZ3RoID09PSAwIHx8IHN0YWdlc1tzdGFnZXMubGVuZ3RoIC0gMV0ub3V0U2l6ZSAhPT0gMSkge1xuICAgIGNvbnN0IG91dFNpemU6IG51bWJlciA9XG4gICAgICAgIHN0YWdlcy5sZW5ndGggPyBzdGFnZXNbc3RhZ2VzLmxlbmd0aCAtIDFdLm91dFNpemUgOiBpblNoYXBlWzFdO1xuICAgIGNvbnN0IHdpbmRvd1NpemUgPSBiYWNrZW5kX3V0aWwuY29tcHV0ZU9wdGltYWxXaW5kb3dTaXplKG91dFNpemUpO1xuICAgIHN0YWdlcy5wdXNoKHtcbiAgICAgIGluU2l6ZTogb3V0U2l6ZSxcbiAgICAgIHdpbmRvd1NpemUsXG4gICAgICBvdXRTaXplOiBNYXRoLmNlaWwob3V0U2l6ZSAvIHdpbmRvd1NpemUpXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gc3RhZ2VzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlKFxuICAgIHg6IFRlbnNvckluZm8sIGR0eXBlOiBEYXRhVHlwZSwgcmVkdWN0aW9uVHlwZTogUmVkdWNlVHlwZXMsXG4gICAgYmFja2VuZDogTWF0aEJhY2tlbmRXZWJHTCk6IFRlbnNvckluZm8ge1xuICBjb25zdCByZWR1Y3Rpb25TdGFnZXMgPSBnZXRSZWR1Y3Rpb25TdGFnZXMoeC5zaGFwZSk7XG5cbiAgbGV0IHJlc3VsdCA9IHg7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmVkdWN0aW9uU3RhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qge2luU2l6ZSwgd2luZG93U2l6ZSwgb3V0U2l6ZX0gPSByZWR1Y3Rpb25TdGFnZXNbaV07XG5cbiAgICBsZXQgcHJvZ3JhbTogUmVkdWNlUHJvZ3JhbXxNZWFuUHJvZ3JhbTtcbiAgICBsZXQgcHJldmlvdXNSZXN1bHQ6IFRlbnNvckluZm87XG4gICAgaWYgKHJlZHVjdGlvblR5cGUgPT09ICdtZWFuJykge1xuICAgICAgcHJvZ3JhbSA9IGkgPT09IDAgP1xuICAgICAgICAgIG5ldyBNZWFuUHJvZ3JhbShcbiAgICAgICAgICAgICAge3dpbmRvd1NpemUsIGluU2l6ZSwgYmF0Y2hTaXplOiB4LnNoYXBlWzBdLCBvdXRTaXplfSwgaW5TaXplKSA6XG4gICAgICAgICAgbmV3IE1lYW5Qcm9ncmFtKHt3aW5kb3dTaXplLCBpblNpemUsIGJhdGNoU2l6ZTogeC5zaGFwZVswXSwgb3V0U2l6ZX0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9ncmFtID0gbmV3IFJlZHVjZVByb2dyYW0oXG4gICAgICAgICAge3dpbmRvd1NpemUsIGluU2l6ZSwgYmF0Y2hTaXplOiB4LnNoYXBlWzBdLCBvdXRTaXplfSwgcmVkdWN0aW9uVHlwZSk7XG4gICAgfVxuXG4gICAgcHJldmlvdXNSZXN1bHQgPSByZXN1bHQ7XG4gICAgcmVzdWx0ID0gYmFja2VuZC5ydW5XZWJHTFByb2dyYW0ocHJvZ3JhbSwgW3Jlc3VsdF0sIGR0eXBlKTtcblxuICAgIGlmIChwcmV2aW91c1Jlc3VsdC5kYXRhSWQgIT09IHguZGF0YUlkKSB7XG4gICAgICBiYWNrZW5kLmRpc3Bvc2VJbnRlcm1lZGlhdGVUZW5zb3JJbmZvKHByZXZpb3VzUmVzdWx0KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIl19