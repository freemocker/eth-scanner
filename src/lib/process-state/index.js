const stateContext = Symbol('process-state-context');

class ProcessState {

  constructor(options, { containerId, requestCount }) {
    this[stateContext] = {
      context: { containerId, requestCount },
      ...options,
    };
  }

  get context() {
    return this[stateContext].context;
  }

  get address() {
    return this[stateContext].address;
  }

  static create(options, context) {
    return new ProcessState(options, context);
  }

}

module.exports = exports = ProcessState;
