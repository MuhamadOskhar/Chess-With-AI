/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
import { env, util } from '@tensorflow/tfjs-core';
export var PackingScheme;
(function (PackingScheme) {
    /**
     * All values in a single texel are densely packed without any constraints.
     *
     * This is how the shader encodes a tensor with shape = [2, 3, 4]
     * (indices are [batch, row, col]).
     *
     * 000|001   010|011   020|021
     * -------   -------   -------
     * 002|003   012|013   022|023
     *
     * 100|101   110|111   120|121
     * -------   -------   -------
     * 102|103   112|113   122|123
     *
     */
    PackingScheme[PackingScheme["DENSE"] = 0] = "DENSE";
    /**
     * Single texels contain only values from the same batch, and from adjacent
     * rows and columns.
     *
     * This is how the shader encodes a tensor with shape = [2, 3, 5]
     * (indices are [batch, row, col]).
     *
     * 000|001   002|003   004|xxx   020|021   022|023   024|xxx
     * -------   -------   -------   -------   -------   -------
     * 010|011   012|013   014|xxx   xxx|xxx   xxx|xxx   xxx|xxx
     *
     * 100|101   102|103   104|xxx   120|121   122|123   124|xxx
     * -------   -------   -------   -------   -------   -------
     * 110|111   112|113   114|xxx   xxx|xxx   xxx|xxx   xxx|xxx
     *
     */
    PackingScheme[PackingScheme["SHARED_BATCH"] = 1] = "SHARED_BATCH";
})(PackingScheme || (PackingScheme = {}));
export var TextureUsage;
(function (TextureUsage) {
    TextureUsage[TextureUsage["RENDER"] = 0] = "RENDER";
    TextureUsage[TextureUsage["UPLOAD"] = 1] = "UPLOAD";
    TextureUsage[TextureUsage["PIXELS"] = 2] = "PIXELS";
    TextureUsage[TextureUsage["DOWNLOAD"] = 3] = "DOWNLOAD";
})(TextureUsage || (TextureUsage = {}));
export var PhysicalTextureType;
(function (PhysicalTextureType) {
    PhysicalTextureType[PhysicalTextureType["UNPACKED_FLOAT16"] = 0] = "UNPACKED_FLOAT16";
    PhysicalTextureType[PhysicalTextureType["UNPACKED_FLOAT32"] = 1] = "UNPACKED_FLOAT32";
    PhysicalTextureType[PhysicalTextureType["PACKED_4X1_UNSIGNED_BYTE"] = 2] = "PACKED_4X1_UNSIGNED_BYTE";
    PhysicalTextureType[PhysicalTextureType["PACKED_2X2_FLOAT32"] = 3] = "PACKED_2X2_FLOAT32";
    PhysicalTextureType[PhysicalTextureType["PACKED_2X2_FLOAT16"] = 4] = "PACKED_2X2_FLOAT16";
})(PhysicalTextureType || (PhysicalTextureType = {}));
export function getUnpackedMatrixTextureShapeWidthHeight(rows, columns) {
    return [columns, rows];
}
export function getUnpackedArraySizeFromMatrixSize(matrixSize, channelsPerTexture) {
    return matrixSize * channelsPerTexture;
}
export function getColorMatrixTextureShapeWidthHeight(rows, columns) {
    return [columns * 4, rows];
}
/**
 * Get shape for densely packed RGBA texture.
 */
export function getDenseTexShape(shape) {
    const size = util.sizeFromShape(shape);
    const texelsNeeded = Math.ceil(size / 4);
    return util.sizeToSquarishShape(texelsNeeded);
}
export function getMatrixSizeFromUnpackedArraySize(unpackedSize, channelsPerTexture) {
    if (unpackedSize % channelsPerTexture !== 0) {
        throw new Error(`unpackedSize (${unpackedSize}) must be a multiple of ` +
            `${channelsPerTexture}`);
    }
    return unpackedSize / channelsPerTexture;
}
export function decodeMatrixFromUnpackedColorRGBAArray(unpackedArray, matrix, channels) {
    const requiredSize = unpackedArray.length * channels / 4;
    if (matrix.length < requiredSize) {
        throw new Error(`matrix length (${matrix.length}) must be >= ${requiredSize}`);
    }
    let dst = 0;
    for (let src = 0; src < unpackedArray.length; src += 4) {
        for (let c = 0; c < channels; c++) {
            matrix[dst++] = unpackedArray[src + c];
        }
    }
}
export function getPackedMatrixTextureShapeWidthHeight(rows, columns) {
    return [
        Math.max(1, Math.ceil(columns / 2)), Math.max(1, Math.ceil(rows / 2))
    ];
}
export function getPackedRGBAArraySizeFromMatrixShape(rows, columns) {
    const [w, h] = getPackedMatrixTextureShapeWidthHeight(rows, columns);
    return w * h * 4;
}
export function getTextureConfig(
// tslint:disable-next-line:no-any
gl, textureHalfFloatExtension) {
    // tslint:disable-next-line:no-any
    const glany = gl;
    let internalFormatFloat;
    let internalFormatHalfFloat;
    let internalFormatPackedHalfFloat;
    let internalFormatPackedFloat;
    let textureFormatFloat;
    let downloadTextureFormat;
    let downloadUnpackNumChannels;
    let defaultNumChannels;
    let textureTypeHalfFloat;
    let textureTypeFloat;
    if (env().getNumber('WEBGL_VERSION') === 2) {
        internalFormatFloat = glany.R32F;
        internalFormatHalfFloat = glany.R16F;
        internalFormatPackedHalfFloat = glany.RGBA16F;
        internalFormatPackedFloat = glany.RGBA32F;
        textureFormatFloat = glany.RED;
        downloadUnpackNumChannels = 4;
        defaultNumChannels = 1;
        textureTypeHalfFloat = glany.HALF_FLOAT;
        textureTypeFloat = glany.FLOAT;
        downloadTextureFormat = glany.RGBA8;
    }
    else {
        internalFormatFloat = gl.RGBA;
        internalFormatHalfFloat = gl.RGBA;
        internalFormatPackedHalfFloat = gl.RGBA;
        internalFormatPackedFloat = glany.RGBA;
        textureFormatFloat = gl.RGBA;
        downloadUnpackNumChannels = 4;
        defaultNumChannels = 4;
        textureTypeHalfFloat = textureHalfFloatExtension != null ?
            textureHalfFloatExtension.HALF_FLOAT_OES :
            null;
        textureTypeFloat = gl.FLOAT;
        downloadTextureFormat = gl.RGBA;
    }
    return {
        internalFormatFloat,
        internalFormatHalfFloat,
        internalFormatPackedHalfFloat,
        internalFormatPackedFloat,
        textureFormatFloat,
        downloadTextureFormat,
        downloadUnpackNumChannels,
        defaultNumChannels,
        textureTypeHalfFloat,
        textureTypeFloat
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4X3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL3RleF91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBaUMsR0FBRyxFQUFjLElBQUksRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRTVGLE1BQU0sQ0FBTixJQUFZLGFBbUNYO0FBbkNELFdBQVksYUFBYTtJQUN2Qjs7Ozs7Ozs7Ozs7Ozs7T0FjRztJQUNILG1EQUFLLENBQUE7SUFFTDs7Ozs7Ozs7Ozs7Ozs7O09BZUc7SUFDSCxpRUFBWSxDQUFBO0FBQ2QsQ0FBQyxFQW5DVyxhQUFhLEtBQWIsYUFBYSxRQW1DeEI7QUFFRCxNQUFNLENBQU4sSUFBWSxZQUtYO0FBTEQsV0FBWSxZQUFZO0lBQ3RCLG1EQUFNLENBQUE7SUFDTixtREFBTSxDQUFBO0lBQ04sbURBQU0sQ0FBQTtJQUNOLHVEQUFRLENBQUE7QUFDVixDQUFDLEVBTFcsWUFBWSxLQUFaLFlBQVksUUFLdkI7QUFFRCxNQUFNLENBQU4sSUFBWSxtQkFNWDtBQU5ELFdBQVksbUJBQW1CO0lBQzdCLHFGQUFnQixDQUFBO0lBQ2hCLHFGQUFnQixDQUFBO0lBQ2hCLHFHQUF3QixDQUFBO0lBQ3hCLHlGQUFrQixDQUFBO0lBQ2xCLHlGQUFrQixDQUFBO0FBQ3BCLENBQUMsRUFOVyxtQkFBbUIsS0FBbkIsbUJBQW1CLFFBTTlCO0FBa0NELE1BQU0sVUFBVSx3Q0FBd0MsQ0FDcEQsSUFBWSxFQUFFLE9BQWU7SUFDL0IsT0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN6QixDQUFDO0FBRUQsTUFBTSxVQUFVLGtDQUFrQyxDQUM5QyxVQUFrQixFQUFFLGtCQUEwQjtJQUNoRCxPQUFPLFVBQVUsR0FBRyxrQkFBa0IsQ0FBQztBQUN6QyxDQUFDO0FBRUQsTUFBTSxVQUFVLHFDQUFxQyxD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a0JBQWtCO1FBQ2xCLHFCQUFxQjtRQUNyQix5QkFBeUI7UUFDekIsa0JBQWtCO1FBQ2xCLG9CQUFvQjtRQUNwQixnQkFBZ0I7S0FDakIsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7YmFja2VuZF91dGlsLCBEYXRhSWQsIERhdGFUeXBlLCBlbnYsIFRlbnNvckluZm8sIHV0aWx9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmV4cG9ydCBlbnVtIFBhY2tpbmdTY2hlbWUge1xuICAvKipcbiAgICogQWxsIHZhbHVlcyBpbiBhIHNpbmdsZSB0ZXhlbCBhcmUgZGVuc2VseSBwYWNrZWQgd2l0aG91dCBhbnkgY29uc3RyYWludHMuXG4gICAqXG4gICAqIFRoaXMgaXMgaG93IHRoZSBzaGFkZXIgZW5jb2RlcyBhIHRlbnNvciB3aXRoIHNoYXBlID0gWzIsIDMsIDRdXG4gICAqIChpbmRpY2VzIGFyZSBbYmF0Y2gsIHJvdywgY29sXSkuXG4gICAqXG4gICAqIDAwMHwwMDEgICAwMTB8MDExICAgMDIwfDAyMVxuICAgKiAtLS0tLS0tICAgLS0tLS0tLSAgIC0tLS0tLS1cbiAgICogMDAyfDAwMyAgIDAxMnwwMTMgICAwMjJ8MDIzXG4gICAqXG4gICAqIDEwMHwxMDEgICAxMTB8MTExICAgMTIwfDEyMVxuICAgKiAtLS0tLS0tICAgLS0tLS0tLSAgIC0tLS0tLS1cbiAgICogMTAyfDEwMyAgIDExMnwxMTMgICAxMjJ8MTIzXG4gICAqXG4gICAqL1xuICBERU5TRSxcblxuICAvKipcbiAgICogU2luZ2xlIHRleGVscyBjb250YWluIG9ubHkgdmFsdWVzIGZyb20gdGhlIHNhbWUgYmF0Y2gsIGFuZCBmcm9tIGFkamFjZW50XG4gICAqIHJvd3MgYW5kIGNvbHVtbnMuXG4gICAqXG4gICAqIFRoaXMgaXMgaG93IHRoZSBzaGFkZXIgZW5jb2RlcyBhIHRlbnNvciB3aXRoIHNoYXBlID0gWzIsIDMsIDVdXG4gICAqIChpbmRpY2VzIGFyZSBbYmF0Y2gsIHJvdywgY29sXSkuXG4gICAqXG4gICAqIDAwMHwwMDEgICAwMDJ8MDAzICAgMDA0fHh4eCAgIDAyMHwwMjEgICAwMjJ8MDIzICAgMDI0fHh4eFxuICAgKiAtLS0tLS0tICAgLS0tLS0tLSAgIC0tLS0tLS0gICAtLS0tLS0tICAgLS0tLS0tLSAgIC0tLS0tLS1cbiAgICogMDEwfDAxMSAgIDAxMnwwMTMgICAwMTR8eHh4ICAgeHh4fHh4eCAgIHh4eHx4eHggICB4eHh8eHh4XG4gICAqXG4gICAqIDEwMHwxMDEgICAxMDJ8MTAzICAgMTA0fHh4eCAgIDEyMHwxMjEgICAxMjJ8MTIzICAgMTI0fHh4eFxuICAgKiAtLS0tLS0tICAgLS0tLS0tLSAgIC0tLS0tLS0gICAtLS0tLS0tICAgLS0tLS0tLSAgIC0tLS0tLS1cbiAgICogMTEwfDExMSAgIDExMnwxMTMgICAxMTR8eHh4ICAgeHh4fHh4eCAgIHh4eHx4eHggICB4eHh8eHh4XG4gICAqXG4gICAqL1xuICBTSEFSRURfQkFUQ0hcbn1cblxuZXhwb3J0IGVudW0gVGV4dHVyZVVzYWdlIHtcbiAgUkVOREVSLFxuICBVUExPQUQsXG4gIFBJWEVMUyxcbiAgRE9XTkxPQURcbn1cblxuZXhwb3J0IGVudW0gUGh5c2ljYWxUZXh0dXJlVHlwZSB7XG4gIFVOUEFDS0VEX0ZMT0FUMTYsXG4gIFVOUEFDS0VEX0ZMT0FUMzIsXG4gIFBBQ0tFRF80WDFfVU5TSUdORURfQllURSxcbiAgUEFDS0VEXzJYMl9GTE9BVDMyLFxuICBQQUNLRURfMlgyX0ZMT0FUMTZcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUZXh0dXJlIHtcbiAgdGV4dHVyZTogV2ViR0xUZXh0dXJlO1xuICB0ZXhTaGFwZTogW251bWJlciwgbnVtYmVyXTtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgVGV4dHVyZURhdGEge1xuICAvLyBSZXF1aXJlZC5cbiAgc2hhcGU6IG51bWJlcltdO1xuICBkdHlwZTogRGF0YVR5cGU7XG5cbiAgLy8gT3B0aW9uYWwuXG4gIHZhbHVlcz86IGJhY2tlbmRfdXRpbC5CYWNrZW5kVmFsdWVzO1xuICB0ZXh0dXJlPzogVGV4dHVyZTtcbiAgLy8gRm9yIGNvbXBsZXggbnVtYmVycywgdGhlIHJlYWwgYW5kIGltYWdpbmFyeSBwYXJ0cyBhcmUgc3RvcmVkIGFzIHRoZWlyIG93blxuICAvLyBpbmRpdmlkdWFsIHRlbnNvckluZm9zLCB3aXRoIGEgcGFyZW50IGpvaW5pbmcgdGhlIHR3byB3aXRoIHRoZVxuICAvLyBjb21wbGV4VGVuc29ycyBmaWVsZC4gV2hlbiB0aGlzIGlzIGRlZmluZWQsIHRleHR1cmUgd2lsbCBiZSBudWxsLlxuICBjb21wbGV4VGVuc29ySW5mb3M/OiB7cmVhbDogVGVuc29ySW5mbywgaW1hZzogVGVuc29ySW5mb307XG4gIC8qKiBbcm93cywgY29sdW1uc10gc2hhcGUgb2YgdGhlIHRleHR1cmUuICovXG4gIHRleFNoYXBlPzogW251bWJlciwgbnVtYmVyXTtcbiAgdXNhZ2U/OiBUZXh0dXJlVXNhZ2U7XG4gIGlzUGFja2VkPzogYm9vbGVhbjtcblxuICByZWZDb3VudDogbnVtYmVyO1xuXG4gIC8vIEF2YWlsYWJsZSB3aGVuIHRoZSB0ZW5zb3IgaGFzIGJlZW4gc2xpY2VkLlxuICBzbGljZT86IHtcbiAgICAvLyBPZmZzZXQgaW4gdGhlICdmbGF0IGluZGV4JyBzcGFjZS5cbiAgICBmbGF0T2Zmc2V0OiBudW1iZXI7XG4gICAgLy8gVXNlZCBmb3IgY291bnRpbmcgaG93IG1hbnkgc2xpY2VkIHRlbnNvcnMgcG9pbnQgdG8gdGhlIHNhbWUgdGV4dHVyZS5cbiAgICBvcmlnRGF0YUlkOiBEYXRhSWQ7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRVbnBhY2tlZE1hdHJpeFRleHR1cmVTaGFwZVdpZHRoSGVpZ2h0KFxuICAgIHJvd3M6IG51bWJlciwgY29sdW1uczogbnVtYmVyKTogW251bWJlciwgbnVtYmVyXSB7XG4gIHJldHVybiBbY29sdW1ucywgcm93c107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRVbnBhY2tlZEFycmF5U2l6ZUZyb21NYXRyaXhTaXplKFxuICAgIG1hdHJpeFNpemU6IG51bWJlciwgY2hhbm5lbHNQZXJUZXh0dXJlOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gbWF0cml4U2l6ZSAqIGNoYW5uZWxzUGVyVGV4dHVyZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbG9yTWF0cml4VGV4dHVyZVNoYXBlV2lkdGhIZWlnaHQoXG4gICAgcm93czogbnVtYmVyLCBjb2x1bW5zOiBudW1iZXIpOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgcmV0dXJuIFtjb2x1bW5zICogNCwgcm93c107XG59XG5cbi8qKlxuICogR2V0IHNoYXBlIGZvciBkZW5zZWx5IHBhY2tlZCBSR0JBIHRleHR1cmUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXREZW5zZVRleFNoYXBlKHNoYXBlOiBudW1iZXJbXSk6IFtudW1iZXIsIG51bWJlcl0ge1xuICBjb25zdCBzaXplID0gdXRpbC5zaXplRnJvbVNoYXBlKHNoYXBlKTtcbiAgY29uc3QgdGV4ZWxzTmVlZGVkID0gTWF0aC5jZWlsKHNpemUgLyA0KTtcbiAgcmV0dXJuIHV0aWwuc2l6ZVRvU3F1YXJpc2hTaGFwZSh0ZXhlbHNOZWVkZWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0cml4U2l6ZUZyb21VbnBhY2tlZEFycmF5U2l6ZShcbiAgICB1bnBhY2tlZFNpemU6IG51bWJlciwgY2hhbm5lbHNQZXJUZXh0dXJlOiBudW1iZXIpOiBudW1iZXIge1xuICBpZiAodW5wYWNrZWRTaXplICUgY2hhbm5lbHNQZXJUZXh0dXJlICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgdW5wYWNrZWRTaXplICgke3VucGFja2VkU2l6ZX0pIG11c3QgYmUgYSBtdWx0aXBsZSBvZiBgICtcbiAgICAgICAgYCR7Y2hhbm5lbHNQZXJUZXh0dXJlfWApO1xuICB9XG4gIHJldHVybiB1bnBhY2tlZFNpemUgLyBjaGFubmVsc1BlclRleHR1cmU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWNvZGVNYXRyaXhGcm9tVW5wYWNrZWRDb2xvclJHQkFBcnJheShcbiAgICB1bnBhY2tlZEFycmF5OiBGbG9hdDMyQXJyYXksIG1hdHJpeDogRmxvYXQzMkFycmF5LCBjaGFubmVsczogbnVtYmVyKSB7XG4gIGNvbnN0IHJlcXVpcmVkU2l6ZSA9IHVucGFja2VkQXJyYXkubGVuZ3RoICogY2hhbm5lbHMgLyA0O1xuICBpZiAobWF0cml4Lmxlbmd0aCA8IHJlcXVpcmVkU2l6ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYG1hdHJpeCBsZW5ndGggKCR7bWF0cml4Lmxlbmd0aH0pIG11c3QgYmUgPj0gJHtyZXF1aXJlZFNpemV9YCk7XG4gIH1cbiAgbGV0IGRzdCA9IDA7XG4gIGZvciAobGV0IHNyYyA9IDA7IHNyYyA8IHVucGFja2VkQXJyYXkubGVuZ3RoOyBzcmMgKz0gNCkge1xuICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY2hhbm5lbHM7IGMrKykge1xuICAgICAgbWF0cml4W2RzdCsrXSA9IHVucGFja2VkQXJyYXlbc3JjICsgY107XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYWNrZWRNYXRyaXhUZXh0dXJlU2hhcGVXaWR0aEhlaWdodChcbiAgICByb3dzOiBudW1iZXIsIGNvbHVtbnM6IG51bWJlcik6IFtudW1iZXIsIG51bWJlcl0ge1xuICByZXR1cm4gW1xuICAgIE1hdGgubWF4KDEsIE1hdGguY2VpbChjb2x1bW5zIC8gMikpLCBNYXRoLm1heCgxLCBNYXRoLmNlaWwocm93cyAvIDIpKVxuICBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFja2VkUkdCQUFycmF5U2l6ZUZyb21NYXRyaXhTaGFwZShcbiAgICByb3dzOiBudW1iZXIsIGNvbHVtbnM6IG51bWJlcik6IG51bWJlciB7XG4gIGNvbnN0IFt3LCBoXSA9IGdldFBhY2tlZE1hdHJpeFRleHR1cmVTaGFwZVdpZHRoSGVpZ2h0KHJvd3MsIGNvbHVtbnMpO1xuICByZXR1cm4gdyAqIGggKiA0O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRleHR1cmVDb25maWcge1xuICBpbnRlcm5hbEZvcm1hdEZsb2F0OiBudW1iZXI7XG4gIHRleHR1cmVGb3JtYXRGbG9hdDogbnVtYmVyO1xuICBpbnRlcm5hbEZvcm1hdFBhY2tlZEhhbGZGbG9hdDogbnVtYmVyO1xuICBpbnRlcm5hbEZvcm1hdEhhbGZGbG9hdDogbnVtYmVyO1xuICBpbnRlcm5hbEZvcm1hdFBhY2tlZEZsb2F0OiBudW1iZXI7XG5cbiAgLy8gVGhlIGZvcm1hdCB0byB1c2UgZHVyaW5nIGEgZ2wucmVhZFBpeGVscyBjYWxsLlxuICBkb3dubG9hZFRleHR1cmVGb3JtYXQ6IG51bWJlcjtcbiAgLy8gSG93IG1hbnkgY2hhbm5lbHMgbmVlZCB0byBiZSB1bnBhY2tlZCBhZnRlciBhIGdsLnJlYWRQaXhlbHMgY2FsbC5cbiAgZG93bmxvYWRVbnBhY2tOdW1DaGFubmVsczogbnVtYmVyO1xuXG4gIGRlZmF1bHROdW1DaGFubmVsczogbnVtYmVyO1xuICB0ZXh0dXJlVHlwZUhhbGZGbG9hdDogbnVtYmVyO1xuICB0ZXh0dXJlVHlwZUZsb2F0OiBudW1iZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUZXh0dXJlQ29uZmlnKFxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCB0ZXh0dXJlSGFsZkZsb2F0RXh0ZW5zaW9uPzogYW55KTogVGV4dHVyZUNvbmZpZyB7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgY29uc3QgZ2xhbnkgPSBnbCBhcyBhbnk7XG5cbiAgbGV0IGludGVybmFsRm9ybWF0RmxvYXQ6IG51bWJlcjtcbiAgbGV0IGludGVybmFsRm9ybWF0SGFsZkZsb2F0OiBudW1iZXI7XG4gIGxldCBpbnRlcm5hbEZvcm1hdFBhY2tlZEhhbGZGbG9hdDogbnVtYmVyO1xuICBsZXQgaW50ZXJuYWxGb3JtYXRQYWNrZWRGbG9hdDogbnVtYmVyO1xuICBsZXQgdGV4dHVyZUZvcm1hdEZsb2F0OiBudW1iZXI7XG5cbiAgbGV0IGRvd25sb2FkVGV4dHVyZUZvcm1hdDogbnVtYmVyO1xuICBsZXQgZG93bmxvYWRVbnBhY2tOdW1DaGFubmVsczogbnVtYmVyO1xuXG4gIGxldCBkZWZhdWx0TnVtQ2hhbm5lbHM6IG51bWJlcjtcbiAgbGV0IHRleHR1cmVUeXBlSGFsZkZsb2F0OiBudW1iZXI7XG4gIGxldCB0ZXh0dXJlVHlwZUZsb2F0OiBudW1iZXI7XG5cbiAgaWYgKGVudigpLmdldE51bWJlcignV0VCR0xfVkVSU0lPTicpID09PSAyKSB7XG4gICAgaW50ZXJuYWxGb3JtYXRGbG9hdCA9IGdsYW55LlIzMkY7XG4gICAgaW50ZXJuYWxGb3JtYXRIYWxmRmxvYXQgPSBnbGFueS5SMTZGO1xuICAgIGludGVybmFsRm9ybWF0UGFja2VkSGFsZkZsb2F0ID0gZ2xhbnkuUkdCQTE2RjtcbiAgICBpbnRlcm5hbEZvcm1hdFBhY2tlZEZsb2F0ID0gZ2xhbnkuUkdCQTMyRjtcbiAgICB0ZXh0dXJlRm9ybWF0RmxvYXQgPSBnbGFueS5SRUQ7XG4gICAgZG93bmxvYWRVbnBhY2tOdW1DaGFubmVscyA9IDQ7XG4gICAgZGVmYXVsdE51bUNoYW5uZWxzID0gMTtcbiAgICB0ZXh0dXJlVHlwZUhhbGZGbG9hdCA9IGdsYW55LkhBTEZfRkxPQVQ7XG4gICAgdGV4dHVyZVR5cGVGbG9hdCA9IGdsYW55LkZMT0FUO1xuICAgIGRvd25sb2FkVGV4dHVyZUZvcm1hdCA9IGdsYW55LlJHQkE4O1xuICB9IGVsc2Uge1xuICAgIGludGVybmFsRm9ybWF0RmxvYXQgPSBnbC5SR0JBO1xuICAgIGludGVybmFsRm9ybWF0SGFsZkZsb2F0ID0gZ2wuUkdCQTtcbiAgICBpbnRlcm5hbEZvcm1hdFBhY2tlZEhhbGZGbG9hdCA9IGdsLlJHQkE7XG4gICAgaW50ZXJuYWxGb3JtYXRQYWNrZWRGbG9hdCA9IGdsYW55LlJHQkE7XG4gICAgdGV4dHVyZUZvcm1hdEZsb2F0ID0gZ2wuUkdCQTtcbiAgICBkb3dubG9hZFVucGFja051bUNoYW5uZWxzID0gNDtcbiAgICBkZWZhdWx0TnVtQ2hhbm5lbHMgPSA0O1xuICAgIHRleHR1cmVUeXBlSGFsZkZsb2F0ID0gdGV4dHVyZUhhbGZGbG9hdEV4dGVuc2lvbiAhPSBudWxsID9cbiAgICAgICAgdGV4dHVyZUhhbGZGbG9hdEV4dGVuc2lvbi5IQUxGX0ZMT0FUX09FUyA6XG4gICAgICAgIG51bGw7XG4gICAgdGV4dHVyZVR5cGVGbG9hdCA9IGdsLkZMT0FUO1xuICAgIGRvd25sb2FkVGV4dHVyZUZvcm1hdCA9IGdsLlJHQkE7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGludGVybmFsRm9ybWF0RmxvYXQsXG4gICAgaW50ZXJuYWxGb3JtYXRIYWxmRmxvYXQsXG4gICAgaW50ZXJuYWxGb3JtYXRQYWNrZWRIYWxmRmxvYXQsXG4gICAgaW50ZXJuYWxGb3JtYXRQYWNrZWRGbG9hdCxcbiAgICB0ZXh0dXJlRm9ybWF0RmxvYXQsXG4gICAgZG93bmxvYWRUZXh0dXJlRm9ybWF0LFxuICAgIGRvd25sb2FkVW5wYWNrTnVtQ2hhbm5lbHMsXG4gICAgZGVmYXVsdE51bUNoYW5uZWxzLFxuICAgIHRleHR1cmVUeXBlSGFsZkZsb2F0LFxuICAgIHRleHR1cmVUeXBlRmxvYXRcbiAgfTtcbn1cbiJdfQ==