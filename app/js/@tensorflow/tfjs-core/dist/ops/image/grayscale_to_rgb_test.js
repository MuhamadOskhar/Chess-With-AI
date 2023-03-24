/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
import * as tf from '../../index';
import { ALL_ENVS, describeWithFlags } from '../../jasmine_util';
import { expectArraysClose } from '../../test_util';
describeWithFlags('grayscaleToRGB', ALL_ENVS, () => {
    it('should convert (1,1,3,1) images into (1,1,3,3)', async () => {
        const grayscale = tf.tensor4d([1.0, 2.0, 3.0], [1, 1, 3, 1]);
        const rgb = tf.image.grayscaleToRGB(grayscale);
        const rgbData = await rgb.data();
        const expected = [1.0, 1.0, 1.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0];
        expect(rgb.shape).toEqual([1, 1, 3, 3]);
        expectArraysClose(rgbData, expected);
    });
    it('should convert (1,2,1) images into (1,2,3)', async () => {
        const grayscale = tf.tensor3d([1.6, 2.4], [1, 2, 1]);
        const rgb = tf.image.grayscaleToRGB(grayscale);
        const rgbData = await rgb.data();
        const expected = [1.6, 1.6, 1.6, 2.4, 2.4, 2.4];
        expect(rgb.shape).toEqual([1, 2, 3]);
        expectArraysClose(rgbData, expected);
    });
    it('should convert (2,1) images into (2,3)', async () => {
        const grayscale = tf.tensor2d([16, 24], [2, 1]);
        const rgb = tf.image.grayscaleToRGB(grayscale);
        const rgbData = await rgb.data();
        const expected = [16, 16, 16, 24, 24, 24];
        expect(rgb.shape).toEqual([2, 3]);
        expectArraysClose(rgbData, expected);
    });
    it('should convert [[[191], [3]]] array into (1,2,3) images', async () => {
        const grayscale = [[[191], [3]]];
        const rgb = tf.image.grayscaleToRGB(grayscale);
        const rgbData = await rgb.data();
        const expected = [191, 191, 191, 3, 3, 3];
        expect(rgb.shape).toEqual([1, 2, 3]);
        expectArraysClose(rgbData, expected);
    });
    it('should throw an error because of input last dim is not 1', () => {
        const grayscale = tf.tensor4d([1.0, 1.0, 2.0, 2.0, 3.0, 3.0], [1, 1, 3, 2]);
        expect(() => tf.image.grayscaleToRGB(grayscale))
            .toThrowError(/last dimension of a grayscale image should be size 1/);
    });
    it('should throw an error because of image\'s rank is less than 2', () => {
        const grayscale = tf.tensor1d([1, 2, 3]);
        expect(() => tf.image.grayscaleToRGB(grayscale))
            .toThrowError(/images must be at least rank 2/);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JheXNjYWxlX3RvX3JnYl90ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvaW1hZ2UvZ3JheXNjYWxlX3RvX3JnYl90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sS0FBSyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ2xDLE9BQU8sRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUUvRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUVsRCxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFO0lBQ2pELEVBQUUsQ0FBQyxnREFBZ0QsRUFBRSxLQUFLLElBQUksRUFBRTtRQUM5RCxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFN0QsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDL0MsTUFBTSxPQUFPLEdBQUcsTUFBTSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFakMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRS9ELE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FB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QU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUMzQyxZQUFZLENBQUMsc0RBQXNELENBQUMsQ0FBQztJQUM1RSxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywrREFBK0QsRUFBRSxHQUFHLEVBQUU7UUFDdkUsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQXdCLENBQUM7UUFFaEUsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQzNDLFlBQVksQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQ3RELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMSBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCAqIGFzIHRmIGZyb20gJy4uLy4uL2luZGV4JztcbmltcG9ydCB7QUxMX0VOVlMsIGRlc2NyaWJlV2l0aEZsYWdzfSBmcm9tICcuLi8uLi9qYXNtaW5lX3V0aWwnO1xuaW1wb3J0IHtUZW5zb3IyRH0gZnJvbSAnLi4vLi4vdGVuc29yJztcbmltcG9ydCB7ZXhwZWN0QXJyYXlzQ2xvc2V9IGZyb20gJy4uLy4uL3Rlc3RfdXRpbCc7XG5cbmRlc2NyaWJlV2l0aEZsYWdzKCdncmF5c2NhbGVUb1JHQicsIEFMTF9FTlZTLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgY29udmVydCAoMSwxLDMsMSkgaW1hZ2VzIGludG8gKDEsMSwzLDMpJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGdyYXlzY2FsZSA9IHRmLnRlbnNvcjRkKFsxLjAsIDIuMCwgMy4wXSwgWzEsIDEsIDMsIDFdKTtcblxuICAgIGNvbnN0IHJnYiA9IHRmLmltYWdlLmdyYXlzY2FsZVRvUkdCKGdyYXlzY2FsZSk7XG4gICAgY29uc3QgcmdiRGF0YSA9IGF3YWl0IHJnYi5kYXRhKCk7XG5cbiAgICBjb25zdCBleHBlY3RlZCA9IFsxLjAsIDEuMCwgMS4wLCAyLjAsIDIuMCwgMi4wLCAzLjAsIDMuMCwgMy4wXTtcblxuICAgIGV4cGVjdChyZ2Iuc2hhcGUpLnRvRXF1YWwoWzEsIDEsIDMsIDNdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShyZ2JEYXRhLCBleHBlY3RlZCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgY29udmVydCAoMSwyLDEpIGltYWdlcyBpbnRvICgxLDIsMyknLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgZ3JheXNjYWxlID0gdGYudGVuc29yM2QoWzEuNiwgMi40XSwgWzEsIDIsIDFdKTtcblxuICAgIGNvbnN0IHJnYiA9IHRmLmltYWdlLmdyYXlzY2FsZVRvUkdCKGdyYXlzY2FsZSk7XG4gICAgY29uc3QgcmdiRGF0YSA9IGF3YWl0IHJnYi5kYXRhKCk7XG5cbiAgICBjb25zdCBleHBlY3RlZCA9IFsxLjYsIDEuNiwgMS42LCAyLjQsIDIuNCwgMi40XTtcblxuICAgIGV4cGVjdChyZ2Iuc2hhcGUpLnRvRXF1YWwoWzEsIDIsIDNdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShyZ2JEYXRhLCBleHBlY3RlZCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgY29udmVydCAoMiwxKSBpbWFnZXMgaW50byAoMiwzKScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBncmF5c2NhbGUgPSB0Zi50ZW5zb3IyZChbMTYsIDI0XSwgWzIsIDFdKTtcblxuICAgIGNvbnN0IHJnYiA9IHRmLmltYWdlLmdyYXlzY2FsZVRvUkdCKGdyYXlzY2FsZSk7XG4gICAgY29uc3QgcmdiRGF0YSA9IGF3YWl0IHJnYi5kYXRhKCk7XG5cbiAgICBjb25zdCBleHBlY3RlZCA9IFsxNiwgMTYsIDE2LCAyNCwgMjQsIDI0XTtcblxuICAgIGV4cGVjdChyZ2Iuc2hhcGUpLnRvRXF1YWwoWzIsIDNdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShyZ2JEYXRhLCBleHBlY3RlZCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgY29udmVydCBbW1sxOTFdLCBbM11dXSBhcnJheSBpbnRvICgxLDIsMykgaW1hZ2VzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGdyYXlzY2FsZSA9IFtbWzE5MV0sIFszXV1dO1xuXG4gICAgY29uc3QgcmdiID0gdGYuaW1hZ2UuZ3JheXNjYWxlVG9SR0IoZ3JheXNjYWxlKTtcbiAgICBjb25zdCByZ2JEYXRhID0gYXdhaXQgcmdiLmRhdGEoKTtcblxuICAgIGNvbnN0IGV4cGVjdGVkID0gWzE5MSwgMTkxLCAxOTEsIDMsIDMsIDNdO1xuXG4gICAgZXhwZWN0KHJnYi5zaGFwZSkudG9FcXVhbChbMSwgMiwgM10pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKHJnYkRhdGEsIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB0aHJvdyBhbiBlcnJvciBiZWNhdXNlIG9mIGlucHV0IGxhc3QgZGltIGlzIG5vdCAxJywgKCkgPT4ge1xuICAgIGNvbnN0IGdyYXlzY2FsZSA9IHRmLnRlbnNvcjRkKFsxLjAsIDEuMCwgMi4wLCAyLjAsIDMuMCwgMy4wXSwgWzEsIDEsIDMsIDJdKTtcblxuICAgIGV4cGVjdCgoKSA9PiB0Zi5pbWFnZS5ncmF5c2NhbGVUb1JHQihncmF5c2NhbGUpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKC9sYXN0IGRpbWVuc2lvbiBvZiBhIGdyYXlzY2FsZSBpbWFnZSBzaG91bGQgYmUgc2l6ZSAxLyk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgdGhyb3cgYW4gZXJyb3IgYmVjYXVzZSBvZiBpbWFnZVxcJ3MgcmFuayBpcyBsZXNzIHRoYW4gMicsICgpID0+IHtcbiAgICBjb25zdCBncmF5c2NhbGUgPSB0Zi50ZW5zb3IxZChbMSwgMiwgM10pIGFzIHVua25vd24gYXMgVGVuc29yMkQ7XG5cbiAgICBleHBlY3QoKCkgPT4gdGYuaW1hZ2UuZ3JheXNjYWxlVG9SR0IoZ3JheXNjYWxlKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigvaW1hZ2VzIG11c3QgYmUgYXQgbGVhc3QgcmFuayAyLyk7XG4gIH0pO1xufSk7XG4iXX0=