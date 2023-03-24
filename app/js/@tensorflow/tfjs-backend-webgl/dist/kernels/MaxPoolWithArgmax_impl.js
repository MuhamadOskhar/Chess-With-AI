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
import { Pool2DProgram } from '../pool_gpu';
export function maxPoolWithArgmaxImpl(x, includeBatchInIndex, convInfo, backend) {
    let program = new Pool2DProgram(convInfo, 'max', false);
    const poolOutput = backend.runWebGLProgram(program, [x], 'float32');
    program = new Pool2DProgram(convInfo, 'max', true, true, includeBatchInIndex);
    const indexOutput = backend.runWebGLProgram(program, [x], 'float32');
    return [poolOutput, indexOutput];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWF4UG9vbFdpdGhBcmdtYXhfaW1wbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMva2VybmVscy9NYXhQb29sV2l0aEFyZ21heF9pbXBsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUtILE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFMUMsTUFBTSxVQUFVLHFCQUFxQixDQUNqQyxDQUFhLEVBQUUsbUJBQTRCLEVBQzNDLFFBQWlDLEVBQ2pDLE9BQXlCO0lBQzNCLElBQUksT0FBTyxHQUFHLElBQUksYUFBYSxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDeEQsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUVwRSxPQUFPLEdBQUcsSUFBSSxhQUFhLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFDOUUsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNyRSxPQUFPLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ25DLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7YmFja2VuZF91dGlsLCBUZW5zb3JJbmZvfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG5pbXBvcnQge01hdGhCYWNrZW5kV2ViR0x9IGZyb20gJy4uL2JhY2tlbmRfd2ViZ2wnO1xuaW1wb3J0IHtQb29sMkRQcm9ncmFtfSBmcm9tICcuLi9wb29sX2dwdSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXhQb29sV2l0aEFyZ21heEltcGwoXG4gICAgeDogVGVuc29ySW5mbywgaW5jbHVkZUJhdGNoSW5JbmRleDogYm9vbGVhbixcbiAgICBjb252SW5mbzogYmFja2VuZF91dGlsLkNvbnYyREluZm8sXG4gICAgYmFja2VuZDogTWF0aEJhY2tlbmRXZWJHTCk6IFRlbnNvckluZm9bXSB7XG4gIGxldCBwcm9ncmFtID0gbmV3IFBvb2wyRFByb2dyYW0oY29udkluZm8sICdtYXgnLCBmYWxzZSk7XG4gIGNvbnN0IHBvb2xPdXRwdXQgPSBiYWNrZW5kLnJ1bldlYkdMUHJvZ3JhbShwcm9ncmFtLCBbeF0sICdmbG9hdDMyJyk7XG5cbiAgcHJvZ3JhbSA9IG5ldyBQb29sMkRQcm9ncmFtKGNvbnZJbmZvLCAnbWF4JywgdHJ1ZSwgdHJ1ZSwgaW5jbHVkZUJhdGNoSW5JbmRleCk7XG4gIGNvbnN0IGluZGV4T3V0cHV0ID0gYmFja2VuZC5ydW5XZWJHTFByb2dyYW0ocHJvZ3JhbSwgW3hdLCAnZmxvYXQzMicpO1xuICByZXR1cm4gW3Bvb2xPdXRwdXQsIGluZGV4T3V0cHV0XTtcbn1cbiJdfQ==