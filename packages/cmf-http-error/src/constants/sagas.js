// used at the last line of sagas unit tests to be sure that the saga ends and does not hang
export const SAGA_FINISHED = { done: true, value: undefined };
export const SAGA_FINISHED_TRUE = { ...SAGA_FINISHED, value: true };
export const SAGA_FINISHED_FALSE = { ...SAGA_FINISHED, value: false };
