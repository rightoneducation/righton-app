import { IMicroCoachSavedPlan } from '../../api/Models/IMicroCoachSavedPlan';
import { initMicroCoachDataState, MicroCoachDataStatus } from '../MicroCoachModels';
import { microCoachDataReducer } from './MicroCoachDataReducer';

const plan = (id: string, classId: string, updatedAt = 't1'): IMicroCoachSavedPlan => ({
  id,
  classId,
  sessionId: null,
  items: [],
  createdAt: 't0',
  updatedAt,
});

describe('microCoachDataReducer', () => {
  it('UPSERT_ROWS replaces a row by id and keeps the others', () => {
    let state = microCoachDataReducer(initMicroCoachDataState, {
      type: 'UPSERT_ROWS',
      table: 'savedPlans',
      rows: [plan('p1', 'c1'), plan('p2', 'c1')],
    });
    state = microCoachDataReducer(state, {
      type: 'UPSERT_ROWS',
      table: 'savedPlans',
      rows: [plan('p1', 'c1', 't2')],
    });
    expect(state.savedPlans.p1.updatedAt).toBe('t2');
    expect(state.savedPlans.p2).toBeDefined();
  });

  it("REPLACE_ROWS drops a parent's rows the answer no longer has, only that parent's", () => {
    let state = microCoachDataReducer(initMicroCoachDataState, {
      type: 'UPSERT_ROWS',
      table: 'savedPlans',
      rows: [plan('p1', 'c1'), plan('p2', 'c1'), plan('p3', 'c2')],
    });
    state = microCoachDataReducer(state, {
      type: 'REPLACE_ROWS',
      table: 'savedPlans',
      rows: [plan('p1', 'c1')],
      parent: { key: 'classId', id: 'c1' },
    });
    expect(Object.keys(state.savedPlans).sort()).toEqual(['p1', 'p3']);
  });

  it('SELECT sets the class and session together', () => {
    const state = microCoachDataReducer(initMicroCoachDataState, {
      type: 'SELECT',
      classId: 'c1',
      sessionId: 's1',
    });
    expect(state.selection).toEqual({ classId: 'c1', sessionId: 's1' });
  });

  it('MARK_LOADS_STALE marks matching loads only, keeping their status', () => {
    let state = microCoachDataReducer(initMicroCoachDataState, {
      type: 'SET_LOAD',
      key: 'class:c1',
      status: MicroCoachDataStatus.READY,
    });
    state = microCoachDataReducer(state, {
      type: 'SET_LOAD',
      key: 'session:s1@GENERATED',
      status: MicroCoachDataStatus.READY,
    });
    state = microCoachDataReducer(state, { type: 'MARK_LOADS_STALE', prefix: 'class:' });
    expect(state.loads['class:c1']).toMatchObject({
      status: MicroCoachDataStatus.READY,
      stale: true,
    });
    expect(state.loads['session:s1@GENERATED'].stale).toBe(false);
  });

  it('sign-out clears every table and moves the epoch on', () => {
    let state = microCoachDataReducer(initMicroCoachDataState, {
      type: 'UPSERT_ROWS',
      table: 'savedPlans',
      rows: [plan('p1', 'c1')],
    });
    state = microCoachDataReducer(state, { type: 'CLEAR_USER_PROFILE' });
    expect(state.savedPlans).toEqual({});
    expect(state.epoch).toBe(1);
  });
});
