import { EmptyChannelError } from "../errors.js";
import { BaseChannel } from "./index.js";

/**
 * Stores the last value received, assumes that if multiple values are received, they are all equal.
 *
 * Note: Unlike 'LastValue' if multiple nodes write to this channel in a single step, the values
 * will be continuously overwritten.
 */
export class AnyValue<Value> extends BaseChannel<Value, Value, Value> {
  lc_graph_name = "AnyValue";

  value: Value | undefined;

  constructor() {
    super();
    this.value = undefined;
  }

  fromCheckpoint(checkpoint?: Value) {
    const empty = new AnyValue<Value>();
    if (checkpoint) {
      empty.value = checkpoint;
    }
    return empty as this;
  }

  update(values: Value[]): boolean {
    if (values.length === 0) {
      const updated = this.value !== undefined;
      this.value = undefined;
      return updated;
    }

    // eslint-disable-next-line prefer-destructuring
    this.value = values[values.length - 1];
    return false;
  }

  get(): Value {
    if (this.value === undefined) {
      throw new EmptyChannelError();
    }
    return this.value;
  }

  checkpoint(): Value {
    if (this.value === undefined) {
      throw new EmptyChannelError();
    }
    return this.value;
  }
}