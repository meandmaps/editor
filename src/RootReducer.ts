import { combineReducers } from 'redux';

import { poiReducer } from './PoiReducer';

export const rootReducer = combineReducers({
    
    poi: poiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
