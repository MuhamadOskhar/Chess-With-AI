/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
import * as tfc from '@tensorflow/tfjs-core';
import { Dataset, LazyIterator } from './dataset_stub';
function mergeBatchSizeAndShape(batchSize, shape) {
    if (Array.isArray(shape)) {
        return [batchSize].concat(shape);
    }
    else {
        const output = {};
        for (const name in shape) {
            output[name] = [batchSize].concat(shape[name]);
        }
        return output;
    }
}
function generateRandomTensorContainer(shape) {
    let output;
    if (Array.isArray(shape)) {
        output = tfc.randomNormal(shape);
    }
    else {
        output = {};
        for (const name in shape) {
            output[name] = tfc.randomNormal(shape[name]);
        }
    }
    return output;
}
class FakeNumericIterator extends LazyIterator {
    constructor(args) {
        super();
        this.tensorIndex = 0;
        this.xBatchShape = mergeBatchSizeAndShape(args.batchSize, args.xShape);
        this.yBatchShape = mergeBatchSizeAndShape(args.batchSize, args.yShape);
        this.numBatches = args.numBatches;
        this.batchCount = 0;
        this.xTensorsFunc = args.xTensorsFunc;
        this.yTensorsFunc = args.yTensorsFunc;
        // Sanity check on the preset tensors.
        tfc.util.assert(this.xTensorsFunc == null && this.yTensorsFunc == null ||
            this.xTensorsFunc != null && this.yTensorsFunc != null, () => 'presetXTensors and presetYTensors must be both null/undefined ' +
            'or both set.');
    }
    async next() {
        const done = ++this.batchCount > this.numBatches;
        if (done) {
            return { done, value: null };
        }
        if (this.xTensorsFunc == null) {
            // Generate data randomly.
            return {
                done,
                value: done ? null : {
                    xs: generateRandomTensorContainer(this.xBatchShape),
                    ys: generateRandomTensorContainer(this.yBatchShape)
                }
            };
        }
        else {
            // Use preset tensors.
            if ((this.batchCount - 1) % this.numBatches === 0) {
                this.xTensorValues = this.xTensorsFunc();
                this.yTensorValues = this.yTensorsFunc();
                this.tensorIndex = 0;
            }
            const index = this.tensorIndex++;
            let xs;
            if (Array.isArray(this.xTensorValues)) {
                xs = this.xTensorValues[index];
                tfc.util.assert(tfc.util.arraysEqual(xs.shape, this.xBatchShape), () => `Shape mismatch: expected: ${JSON.stringify(this.xBatchShape)}; ` +
                    `actual: ${JSON.stringify(xs.shape)}`);
            }
            else {
                xs = {};
                for (const key in this.xTensorValues) {
                    xs[key] = this.xTensorValues[key][index];
                    tfc.util.assert(tfc.util.arraysEqual(xs[key].shape, this.xBatchShape), () => `Shape mismatch: expected: ${JSON.stringify(this.xBatchShape)}; ` +
                        `actual: ${JSON.stringify(xs.shape)}`);
                }
            }
            let ys;
            if (Array.isArray(this.yTensorValues)) {
                // Get preset ys tensors for single-output models.
                ys = this.yTensorValues[index];
                tfc.util.assert(tfc.util.arraysEqual(ys.shape, this.yBatchShape), () => `Shape mismatch: expected: ${JSON.stringify(this.yBatchShape)}; ` +
                    `actual: ${JSON.stringify(ys.shape)}`);
            }
            else {
                // Get preset ys tensors for multi-output models.
                ys = {};
                this.yBatchShape = this.yBatchShape;
                for (const key in this.yTensorValues) {
                    ys[key] = this.yTensorValues[key][index];
                    tfc.util.assert(tfc.util.arraysEqual(ys[key].shape, this.yBatchShape[key]), () => `Shape mismatch: expected: ${JSON.stringify(this.yBatchShape)}; ` +
                        `actual: ${JSON.stringify(ys[key].shape)}`);
                }
            }
            return { done, value: { xs, ys } };
        }
    }
}
/**
 * A fake dataset with configurable feature and target shapes.
 *
 * The batch size and # of batches are also configurable.
 *
 * The iterator from the dataset always generate random-normal float32 values.
 */
export class FakeNumericDataset extends Dataset {
    constructor(args) {
        super();
        this.args = args;
        tfc.util.assert(args.batchSize > 0 && Number.isInteger(args.batchSize), () => `batchSize must be a positive integer, but got ${args.batchSize}`);
        tfc.util.assert(args.numBatches > 0 && Number.isInteger(args.numBatches), () => `numBatches must be positive integer, but got ${args.numBatches}`);
        this.size = args.numBatches;
    }
    async iterator() {
        return new FakeNumericIterator(this.args);
    }
}
// We can't use Dataset.map(...) because we don't depend on tfjs-data here,
// so we manually transform the above {xs, ys} dataset to the [xs, ys] form.
export class FakeNumericDatasetLegacyArrayForm extends Dataset {
    constructor(args) {
        super();
        this.args = args;
        this.ds = new FakeNumericDataset(args);
    }
    async iterator() {
        const it = await this.ds.iterator();
        return new FakeNumericIteratorLegacyArrayForm(it);
    }
}
class FakeNumericIteratorLegacyArrayForm extends LazyIterator {
    constructor(it) {
        super();
        this.it = it;
    }
    async next() {
        const result = await this.it.next();
        return {
            done: result.done,
            value: result.value == null ? null : [result.value.xs, result.value.ys]
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXNldF9mYWtlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtbGF5ZXJzL3NyYy9lbmdpbmUvZGF0YXNldF9mYWtlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7R0FRRztBQUVILE9BQU8sS0FBSyxHQUFHLE1BQU0sdUJBQXVCLENBQUM7QUFLN0MsT0FBTyxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQTJDckQsU0FBUyxzQkFBc0IsQ0FDM0IsU0FBaUIsRUFBRSxLQUFvQztJQUV6RCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDeEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNsQztTQUFNO1FBQ0wsTUFBTSxNQUFNLEdBQTRCLEVBQUUsQ0FBQztRQUMzQyxLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtZQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDaEQ7UUFDRCxPQUFPLE1BQU0sQ0FBQztLQUNmO0FBQ0gsQ0FBQztBQUVELFNBQVMsNkJBQTZCLENBQUMsS0FBb0M7SUFFekUsSUFBSSxNQUErQyxDQUFDO0lBQ3BELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN4QixNQUFNLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNsQztTQUFNO1FBQ0wsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNaLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO1lBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMs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RSxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztTQUN4RSxDQUFDO0lBQ0osQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICogbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gKiBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0ICogYXMgdGZjIGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7U2hhcGV9IGZyb20gJy4uL2tlcmFzX2Zvcm1hdC9jb21tb24nO1xuaW1wb3J0IHtUZW5zb3JPckFycmF5T3JNYXB9IGZyb20gJy4uL3R5cGVzJztcblxuaW1wb3J0IHtEYXRhc2V0LCBMYXp5SXRlcmF0b3J9IGZyb20gJy4vZGF0YXNldF9zdHViJztcbmltcG9ydCB7Rml0RGF0YXNldEVsZW1lbnR9IGZyb20gJy4vdHJhaW5pbmdfZGF0YXNldCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmFrZURhdGFzZXRBcmdzIHtcbiAgLyoqXG4gICAqIFRoZSBzaGFwZShzKSBvZiB0aGUgZmVhdHVyZXMgb2YgYSBzaW5nbGUgZXhhbXBsZS5cbiAgICpcbiAgICogVXNlIGFuIG9iamVjdCBtYXBwaW5nIG5hbWUgdG8gc2hhcGUsIGlmIG1vcmUgdGhhbiBvbmUgZmVhdHVyZSB0ZW5zb3JzXG4gICAqIGFyZSByZXF1aXJlZC5cbiAgICovXG4gIHhTaGFwZTogU2hhcGV8e1tuYW1lOiBzdHJpbmddOiBTaGFwZX07XG5cbiAgLyoqXG4gICAqIFRoZSBzaGFwZSBvZiB0aGUgdGFyZ2V0KHMpIG9mIGEgc2luZ2xlIGV4YXBtbGUuXG4gICAqL1xuICB5U2hhcGU6IFNoYXBlfHtbbmFtZTogc3RyaW5nXTogU2hhcGV9O1xuXG4gIC8qKlxuICAgKiBBIGZ1bmN0aW9uIHRoYXQgZ2VuZXJhdGVzIHByZXNldCBzZXF1ZW5jZSBvZiBYIHRlbnNvcnMuXG4gICAqXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgaW52b2tlZCBlYWNoIHRpbWUgYSBuZXcgaXRlcmF0b3IgaXMgY3JlYXRlZC5cbiAgICovXG4gIHhUZW5zb3JzRnVuYz86ICgpID0+IHRmYy5UZW5zb3JbXSB8IHtbbmFtZTogc3RyaW5nXTogdGZjLlRlbnNvcltdfTtcblxuICAvKipcbiAgICogQSBmdW5jdGlvbiB0aGF0IGdlbmVyYXRlcyBwcmVzZXQgc2VxdWVuY2Ugb2YgWSB0ZW5zb3JzLlxuICAgKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGlzIGludm9rZWQgZWFjaCB0aW1lIGEgbmV3IGl0ZXJhdG9yIGlzIGNyZWF0ZWQuXG4gICAqL1xuICB5VGVuc29yc0Z1bmM/OiAoKSA9PiB0ZmMuVGVuc29yW10gfCB7W25hbWU6IHN0cmluZ106IHRmYy5UZW5zb3JbXX07XG5cbiAgLyoqXG4gICAqIFRoZSBzaXplIG9mIGVhY2ggYmF0Y2ggZ2VuZXJhdGVkIGJ5IHRoZSBpdGVyYXRvci5cbiAgICovXG4gIGJhdGNoU2l6ZTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGJhdGNoZXMgYW4gaXRlcmF0b3IgZ2VuZXJhdGVzIGJlZm9yZSBkZWNsYXJpbmcgZG9uZSB0byBiZVxuICAgKiB0cnVlLlxuICAgKi9cbiAgbnVtQmF0Y2hlczogbnVtYmVyO1xufVxuXG5mdW5jdGlvbiBtZXJnZUJhdGNoU2l6ZUFuZFNoYXBlKFxuICAgIGJhdGNoU2l6ZTogbnVtYmVyLCBzaGFwZTogU2hhcGV8e1tuYW1lOiBzdHJpbmddOiBTaGFwZX0pOiBTaGFwZXxcbiAgICB7W25hbWU6IHN0cmluZ106IFNoYXBlfSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHNoYXBlKSkge1xuICAgIHJldHVybiBbYmF0Y2hTaXplXS5jb25jYXQoc2hhcGUpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IG91dHB1dDoge1tuYW1lOiBzdHJpbmddOiBTaGFwZX0gPSB7fTtcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gc2hhcGUpIHtcbiAgICAgIG91dHB1dFtuYW1lXSA9IFtiYXRjaFNpemVdLmNvbmNhdChzaGFwZVtuYW1lXSk7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21UZW5zb3JDb250YWluZXIoc2hhcGU6IFNoYXBlfHtbbmFtZTogc3RyaW5nXTogU2hhcGV9KTpcbiAgICB0ZmMuVGVuc29yfHtbbmFtZTogc3RyaW5nXTogdGZjLlRlbnNvcn0ge1xuICBsZXQgb3V0cHV0OiB0ZmMuVGVuc29yfHtbbmFtZTogc3RyaW5nXTogdGZjLlRlbnNvcn07XG4gIGlmIChBcnJheS5pc0FycmF5KHNoYXBlKSkge1xuICAgIG91dHB1dCA9IHRmYy5yYW5kb21Ob3JtYWwoc2hhcGUpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IHt9O1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiBzaGFwZSkge1xuICAgICAgb3V0cHV0W25hbWVdID0gdGZjLnJhbmRvbU5vcm1hbChzaGFwZVtuYW1lXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cbmNsYXNzIEZha2VOdW1lcmljSXRlcmF0b3IgZXh0ZW5kcyBMYXp5SXRlcmF0b3I8Rml0RGF0YXNldEVsZW1lbnQ+IHtcbiAgcHJpdmF0ZSB4QmF0Y2hTaGFwZTogU2hhcGV8e1tuYW1lOiBzdHJpbmddOiBTaGFwZX07XG4gIHByaXZhdGUgeUJhdGNoU2hhcGU6IFNoYXBlfHtbbmFtZTogc3RyaW5nXTogU2hhcGV9O1xuICBwcml2YXRlIG51bUJhdGNoZXM6IG51bWJlcjtcbiAgcHJpdmF0ZSBiYXRjaENvdW50OiBudW1iZXI7XG4gIHByaXZhdGUgeFRlbnNvcnNGdW5jOiAoKSA9PiB0ZmMuVGVuc29yW10gfCB7W25hbWU6IHN0cmluZ106IHRmYy5UZW5zb3JbXX07XG4gIHByaXZhdGUgeVRlbnNvcnNGdW5jOiAoKSA9PiB0ZmMuVGVuc29yW10gfCB7W25hbWU6IHN0cmluZ106IHRmYy5UZW5zb3JbXX07XG4gIHByaXZhdGUgeFRlbnNvclZhbHVlczogdGZjLlRlbnNvcltdfHtbbmFtZTogc3RyaW5nXTogdGZjLlRlbnNvcltdfTtcbiAgcHJpdmF0ZSB5VGVuc29yVmFsdWVzOiB0ZmMuVGVuc29yW118e1tuYW1lOiBzdHJpbmddOiB0ZmMuVGVuc29yW119O1xuICBwcml2YXRlIHRlbnNvckluZGV4ID0gMDtcblxuICBjb25zdHJ1Y3RvcihhcmdzOiBGYWtlRGF0YXNldEFyZ3MpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMueEJhdGNoU2hhcGUgPSBtZXJnZUJhdGNoU2l6ZUFuZFNoYXBlKGFyZ3MuYmF0Y2hTaXplLCBhcmdzLnhTaGFwZSk7XG4gICAgdGhpcy55QmF0Y2hTaGFwZSA9IG1lcmdlQmF0Y2hTaXplQW5kU2hhcGUoYXJncy5iYXRjaFNpemUsIGFyZ3MueVNoYXBlKTtcbiAgICB0aGlzLm51bUJhdGNoZXMgPSBhcmdzLm51bUJhdGNoZXM7XG4gICAgdGhpcy5iYXRjaENvdW50ID0gMDtcbiAgICB0aGlzLnhUZW5zb3JzRnVuYyA9IGFyZ3MueFRlbnNvcnNGdW5jO1xuICAgIHRoaXMueVRlbnNvcnNGdW5jID0gYXJncy55VGVuc29yc0Z1bmM7XG5cbiAgICAvLyBTYW5pdHkgY2hlY2sgb24gdGhlIHByZXNldCB0ZW5zb3JzLlxuICAgIHRmYy51dGlsLmFzc2VydChcbiAgICAgICAgdGhpcy54VGVuc29yc0Z1bmMgPT0gbnVsbCAmJiB0aGlzLnlUZW5zb3JzRnVuYyA9PSBudWxsIHx8XG4gICAgICAgICAgICB0aGlzLnhUZW5zb3JzRnVuYyAhPSBudWxsICYmIHRoaXMueVRlbnNvcnNGdW5jICE9IG51bGwsXG4gICAgICAgICgpID0+ICdwcmVzZXRYVGVuc29ycyBhbmQgcHJlc2V0WVRlbnNvcnMgbXVzdCBiZSBib3RoIG51bGwvdW5kZWZpbmVkICcgK1xuICAgICAgICAgICAgJ29yIGJvdGggc2V0LicpO1xuICB9XG5cbiAgYXN5bmMgbmV4dCgpOiBQcm9taXNlPEl0ZXJhdG9yUmVzdWx0PEZpdERhdGFzZXRFbGVtZW50Pj4ge1xuICAgIGNvbnN0IGRvbmUgPSArK3RoaXMuYmF0Y2hDb3VudCA+IHRoaXMubnVtQmF0Y2hlcztcbiAgICBpZiAoZG9uZSkge1xuICAgICAgcmV0dXJuIHtkb25lLCB2YWx1ZTogbnVsbH07XG4gICAgfVxuICAgIGlmICh0aGlzLnhUZW5zb3JzRnVuYyA9PSBudWxsKSB7XG4gICAgICAvLyBHZW5lcmF0ZSBkYXRhIHJhbmRvbWx5LlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZG9uZSxcbiAgICAgICAgdmFsdWU6IGRvbmUgPyBudWxsIDoge1xuICAgICAgICAgIHhzOiBnZW5lcmF0ZVJhbmRvbVRlbnNvckNvbnRhaW5lcih0aGlzLnhCYXRjaFNoYXBlKSxcbiAgICAgICAgICB5czogZ2VuZXJhdGVSYW5kb21UZW5zb3JDb250YWluZXIodGhpcy55QmF0Y2hTaGFwZSlcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXNlIHByZXNldCB0ZW5zb3JzLlxuICAgICAgaWYgKCh0aGlzLmJhdGNoQ291bnQgLSAxKSAlIHRoaXMubnVtQmF0Y2hlcyA9PT0gMCkge1xuICAgICAgICB0aGlzLnhUZW5zb3JWYWx1ZXMgPSB0aGlzLnhUZW5zb3JzRnVuYygpO1xuICAgICAgICB0aGlzLnlUZW5zb3JWYWx1ZXMgPSB0aGlzLnlUZW5zb3JzRnVuYygpO1xuICAgICAgICB0aGlzLnRlbnNvckluZGV4ID0gMDtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy50ZW5zb3JJbmRleCsrO1xuXG4gICAgICBsZXQgeHM6IHRmYy5UZW5zb3J8e1tuYW1lOiBzdHJpbmddOiB0ZmMuVGVuc29yfTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMueFRlbnNvclZhbHVlcykpIHtcbiAgICAgICAgeHMgPSB0aGlzLnhUZW5zb3JWYWx1ZXNbaW5kZXhdO1xuICAgICAgICB0ZmMudXRpbC5hc3NlcnQoXG4gICAgICAgICAgICB0ZmMudXRpbC5hcnJheXNFcXVhbCh4cy5zaGFwZSwgdGhpcy54QmF0Y2hTaGFwZSBhcyBTaGFwZSksXG4gICAgICAgICAgICAoKSA9PiBgU2hhcGUgbWlzbWF0Y2g6IGV4cGVjdGVkOiAke1xuICAgICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHRoaXMueEJhdGNoU2hhcGUpfTsgYCArXG4gICAgICAgICAgICAgICAgYGFjdHVhbDogJHtKU09OLnN0cmluZ2lmeSgoeHMgYXMgdGZjLlRlbnNvcikuc2hhcGUpfWApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeHMgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy54VGVuc29yVmFsdWVzKSB7XG4gICAgICAgICAgeHNba2V5XSA9IHRoaXMueFRlbnNvclZhbHVlc1trZXldW2luZGV4XTtcbiAgICAgICAgICB0ZmMudXRpbC5hc3NlcnQoXG4gICAgICAgICAgICAgIHRmYy51dGlsLmFycmF5c0VxdWFsKHhzW2tleV0uc2hhcGUsIHRoaXMueEJhdGNoU2hhcGUgYXMgU2hhcGUpLFxuICAgICAgICAgICAgICAoKSA9PiBgU2hhcGUgbWlzbWF0Y2g6IGV4cGVjdGVkOiAke1xuICAgICAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkodGhpcy54QmF0Y2hTaGFwZSl9OyBgICtcbiAgICAgICAgICAgICAgICAgIGBhY3R1YWw6ICR7SlNPTi5zdHJpbmdpZnkoKHhzIGFzIHRmYy5UZW5zb3IpLnNoYXBlKX1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgeXM6IHRmYy5UZW5zb3J8e1tuYW1lOiBzdHJpbmddOiB0ZmMuVGVuc29yfTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMueVRlbnNvclZhbHVlcykpIHtcbiAgICAgICAgLy8gR2V0IHByZXNldCB5cyB0ZW5zb3JzIGZvciBzaW5nbGUtb3V0cHV0IG1vZGVscy5cbiAgICAgICAgeXMgPSB0aGlzLnlUZW5zb3JWYWx1ZXNbaW5kZXhdO1xuICAgICAgICB0ZmMudXRpbC5hc3NlcnQoXG4gICAgICAgICAgICB0ZmMudXRpbC5hcnJheXNFcXVhbCh5cy5zaGFwZSwgdGhpcy55QmF0Y2hTaGFwZSBhcyBTaGFwZSksXG4gICAgICAgICAgICAoKSA9PiBgU2hhcGUgbWlzbWF0Y2g6IGV4cGVjdGVkOiAke1xuICAgICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHRoaXMueUJhdGNoU2hhcGUpfTsgYCArXG4gICAgICAgICAgICAgICAgYGFjdHVhbDogJHtKU09OLnN0cmluZ2lmeSgoeXMgYXMgdGZjLlRlbnNvcikuc2hhcGUpfWApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gR2V0IHByZXNldCB5cyB0ZW5zb3JzIGZvciBtdWx0aS1vdXRwdXQgbW9kZWxzLlxuICAgICAgICB5cyA9IHt9O1xuICAgICAgICB0aGlzLnlCYXRjaFNoYXBlID0gdGhpcy55QmF0Y2hTaGFwZSBhcyB7W25hbWU6IHN0cmluZ106IFNoYXBlfTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy55VGVuc29yVmFsdWVzKSB7XG4gICAgICAgICAgeXNba2V5XSA9IHRoaXMueVRlbnNvclZhbHVlc1trZXldW2luZGV4XTtcbiAgICAgICAgICB0ZmMudXRpbC5hc3NlcnQoXG4gICAgICAgICAgICAgIHRmYy51dGlsLmFycmF5c0VxdWFsKHlzW2tleV0uc2hhcGUsIHRoaXMueUJhdGNoU2hhcGVba2V5XSksXG4gICAgICAgICAgICAgICgpID0+IGBTaGFwZSBtaXNtYXRjaDogZXhwZWN0ZWQ6ICR7XG4gICAgICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh0aGlzLnlCYXRjaFNoYXBlKX07IGAgK1xuICAgICAgICAgICAgICAgICAgYGFjdHVhbDogJHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICh5cyBhcyB7W25hbWU6IHN0cmluZ106IHRmYy5UZW5zb3J9KVtrZXldLnNoYXBlKX1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4ge2RvbmUsIHZhbHVlOiB7eHMsIHlzfX07XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQSBmYWtlIGRhdGFzZXQgd2l0aCBjb25maWd1cmFibGUgZmVhdHVyZSBhbmQgdGFyZ2V0IHNoYXBlcy5cbiAqXG4gKiBUaGUgYmF0Y2ggc2l6ZSBhbmQgIyBvZiBiYXRjaGVzIGFyZSBhbHNvIGNvbmZpZ3VyYWJsZS5cbiAqXG4gKiBUaGUgaXRlcmF0b3IgZnJvbSB0aGUgZGF0YXNldCBhbHdheXMgZ2VuZXJhdGUgcmFuZG9tLW5vcm1hbCBmbG9hdDMyIHZhbHVlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEZha2VOdW1lcmljRGF0YXNldCBleHRlbmRzIERhdGFzZXQ8Rml0RGF0YXNldEVsZW1lbnQ+IHtcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgYXJnczogRmFrZURhdGFzZXRBcmdzKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0ZmMudXRpbC5hc3NlcnQoXG4gICAgICAgIGFyZ3MuYmF0Y2hTaXplID4gMCAmJiBOdW1iZXIuaXNJbnRlZ2VyKGFyZ3MuYmF0Y2hTaXplKSxcbiAgICAgICAgKCkgPT5cbiAgICAgICAgICAgIGBiYXRjaFNpemUgbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXIsIGJ1dCBnb3QgJHthcmdzLmJhdGNoU2l6ZX1gKTtcbiAgICB0ZmMudXRpbC5hc3NlcnQoXG4gICAgICAgIGFyZ3MubnVtQmF0Y2hlcyA+IDAgJiYgTnVtYmVyLmlzSW50ZWdlcihhcmdzLm51bUJhdGNoZXMpLFxuICAgICAgICAoKSA9PlxuICAgICAgICAgICAgYG51bUJhdGNoZXMgbXVzdCBiZSBwb3NpdGl2ZSBpbnRlZ2VyLCBidXQgZ290ICR7YXJncy5udW1CYXRjaGVzfWApO1xuICAgIHRoaXMuc2l6ZSA9IGFyZ3MubnVtQmF0Y2hlcztcbiAgfVxuXG4gIGFzeW5jIGl0ZXJhdG9yKCk6IFByb21pc2U8TGF6eUl0ZXJhdG9yPEZpdERhdGFzZXRFbGVtZW50Pj4ge1xuICAgIHJldHVybiBuZXcgRmFrZU51bWVyaWNJdGVyYXRvcih0aGlzLmFyZ3MpO1xuICB9XG59XG5cbi8vIFdlIGNhbid0IHVzZSBEYXRhc2V0Lm1hcCguLi4pIGJlY2F1c2Ugd2UgZG9uJ3QgZGVwZW5kIG9uIHRmanMtZGF0YSBoZXJlLFxuLy8gc28gd2UgbWFudWFsbHkgdHJhbnNmb3JtIHRoZSBhYm92ZSB7eHMsIHlzfSBkYXRhc2V0IHRvIHRoZSBbeHMsIHlzXSBmb3JtLlxuZXhwb3J0IGNsYXNzIEZha2VOdW1lcmljRGF0YXNldExlZ2FjeUFycmF5Rm9ybSBleHRlbmRzXG4gICAgRGF0YXNldDxbVGVuc29yT3JBcnJheU9yTWFwLCBUZW5zb3JPckFycmF5T3JNYXBdPiB7XG4gIGRzOiBGYWtlTnVtZXJpY0RhdGFzZXQ7XG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGFyZ3M6IEZha2VEYXRhc2V0QXJncykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5kcyA9IG5ldyBGYWtlTnVtZXJpY0RhdGFzZXQoYXJncyk7XG4gIH1cblxuICBhc3luYyBpdGVyYXRvcigpOlxuICAgICAgUHJvbWlzZTxMYXp5SXRlcmF0b3I8W1RlbnNvck9yQXJyYXlPck1hcCwgVGVuc29yT3JBcnJheU9yTWFwXT4+IHtcbiAgICBjb25zdCBpdCA9IGF3YWl0IHRoaXMuZHMuaXRlcmF0b3IoKTtcbiAgICByZXR1cm4gbmV3IEZha2VOdW1lcmljSXRlcmF0b3JMZWdhY3lBcnJheUZvcm0oaXQpO1xuICB9XG59XG5cbmNsYXNzIEZha2VOdW1lcmljSXRlcmF0b3JMZWdhY3lBcnJheUZvcm0gZXh0ZW5kc1xuICAgIExhenlJdGVyYXRvcjxbVGVuc29yT3JBcnJheU9yTWFwLCBUZW5zb3JPckFycmF5T3JNYXBdPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgaXQ6IExhenlJdGVyYXRvcjxGaXREYXRhc2V0RWxlbWVudD4pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgYXN5bmMgbmV4dCgpOlxuICAgICAgUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxbVGVuc29yT3JBcnJheU9yTWFwLCBUZW5zb3JPckFycmF5T3JNYXBdPj4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuaXQubmV4dCgpO1xuICAgIHJldHVybiB7XG4gICAgICBkb25lOiByZXN1bHQuZG9uZSxcbiAgICAgIHZhbHVlOiByZXN1bHQudmFsdWUgPT0gbnVsbCA/IG51bGwgOiBbcmVzdWx0LnZhbHVlLnhzLCByZXN1bHQudmFsdWUueXNdXG4gICAgfTtcbiAgfVxufVxuIl19