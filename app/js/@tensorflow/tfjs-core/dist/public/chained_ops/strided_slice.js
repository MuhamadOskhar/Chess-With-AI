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
// TODO update import path once op is modularized.
import { stridedSlice } from '../../ops/ops';
import { getGlobalTensorClass } from '../../tensor';
getGlobalTensorClass().prototype.stridedSlice = function (begin, end, strides, beginMask, endMask, ellipsisMask, newAxisMask, shrinkAxisMask) {
    this.throwIfDisposed();
    return stridedSlice(this, begin, end, strides, beginMask, endMask, ellipsisMask, newAxisMask, shrinkAxisMask);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaWRlZF9zbGljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvcHVibGljL2NoYWluZWRfb3BzL3N0cmlkZWRfc2xpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsa0RBQWtEO0FBQ2xELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFDLG9CQUFvQixFQUFTLE1BQU0sY0FBYyxDQUFDO0FBWTFELG9CQUFvQixFQUFFLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxVQUM5QixLQUFlLEVBQUUsR0FBYSxFQUFFLE9BQWlCLEVBQy9ELFNBQWtCLEVBQUUsT0FBZ0IsRUFBRSxZQUFxQixFQUMzRCxXQUFvQixFQUFFLGNBQXVCO0lBQy9DLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN2QixPQUFPLFlBQVksQ0FDUixJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQzNELFdBQVcsRUFBRSxjQUFjLENBQU0sQ0FBQztBQUMvQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbi8vIFRPRE8gdXBkYXRlIGltcG9ydCBwYXRoIG9uY2Ugb3AgaXMgbW9kdWxhcml6ZWQuXG5pbXBvcnQge3N0cmlkZWRTbGljZX0gZnJvbSAnLi4vLi4vb3BzL29wcyc7XG5pbXBvcnQge2dldEdsb2JhbFRlbnNvckNsYXNzLCBUZW5zb3J9IGZyb20gJy4uLy4uL3RlbnNvcic7XG5pbXBvcnQge1Jhbmt9IGZyb20gJy4uLy4uL3R5cGVzJztcblxuZGVjbGFyZSBtb2R1bGUgJy4uLy4uL3RlbnNvcicge1xuICBpbnRlcmZhY2UgVGVuc29yPFIgZXh0ZW5kcyBSYW5rID0gUmFuaz4ge1xuICAgIHN0cmlkZWRTbGljZTxUIGV4dGVuZHMgVGVuc29yPihcbiAgICAgICAgdGhpczogVGVuc29yLCBiZWdpbjogbnVtYmVyW10sIGVuZDogbnVtYmVyW10sIHN0cmlkZXM6IG51bWJlcltdLFxuICAgICAgICBiZWdpbk1hc2s/OiBudW1iZXIsIGVuZE1hc2s/OiBudW1iZXIsIGVsbGlwc2lzTWFzaz86IG51bWJlcixcbiAgICAgICAgbmV3QXhpc01hc2s/OiBudW1iZXIsIHNocmlua0F4aXNNYXNrPzogbnVtYmVyKTogVGVuc29yO1xuICB9XG59XG5cbmdldEdsb2JhbFRlbnNvckNsYXNzKCkucHJvdG90eXBlLnN0cmlkZWRTbGljZSA9IGZ1bmN0aW9uPFQgZXh0ZW5kcyBUZW5zb3I+KFxuICAgIHRoaXM6IFRlbnNvciwgYmVnaW46IG51bWJlcltdLCBlbmQ6IG51bWJlcltdLCBzdHJpZGVzOiBudW1iZXJbXSxcbiAgICBiZWdpbk1hc2s/OiBudW1iZXIsIGVuZE1hc2s/OiBudW1iZXIsIGVsbGlwc2lzTWFzaz86IG51bWJlcixcbiAgICBuZXdBeGlzTWFzaz86IG51bWJlciwgc2hyaW5rQXhpc01hc2s/OiBudW1iZXIpOiBUIHtcbiAgdGhpcy50aHJvd0lmRGlzcG9zZWQoKTtcbiAgcmV0dXJuIHN0cmlkZWRTbGljZShcbiAgICAgICAgICAgICB0aGlzLCBiZWdpbiwgZW5kLCBzdHJpZGVzLCBiZWdpbk1hc2ssIGVuZE1hc2ssIGVsbGlwc2lzTWFzayxcbiAgICAgICAgICAgICBuZXdBeGlzTWFzaywgc2hyaW5rQXhpc01hc2spIGFzIFQ7XG59O1xuIl19