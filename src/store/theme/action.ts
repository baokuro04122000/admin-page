import { AppThunk } from "..";
import { ThemeType } from '@app/interfaces/interfaces';
import { setTheme, setNightMode, setNightTime } from './slice'


export const actionSetTheme = (
  theme: ThemeType
): AppThunk<Promise<void>> => {
  return async (dispatch) => {
    try {
      localStorage.setItem('theme', theme);
      await dispatch(setTheme(theme))
    } catch (error) {
      console.log(error)
    }
  };
};

export const actionSetNightMode = (
  isNightMode: boolean
): AppThunk<Promise<void>> => {
  return async (dispatch) => {
    try {
      localStorage.setItem('nightMode', JSON.stringify(isNightMode));
      await dispatch(setNightMode(isNightMode))
    } catch (error) {
      console.log(error)
    }
  };
};

export const actionSetNightTime = (
  nightTime: number[]
): AppThunk<Promise<void>> => {
  return async (dispatch) => {
    try {
      localStorage.setItem('nightTime', JSON.stringify(nightTime));
      await dispatch(setNightTime(nightTime))
    } catch (error) {
      console.log(error)
    }
  };
};