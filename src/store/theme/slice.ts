import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ThemeType } from '@app/interfaces/interfaces';


interface ThemeState {
  theme: ThemeType;
  isNightMode: boolean;
  nightTime: number[]
}

export const defaultTheme = (localStorage.getItem('theme') as ThemeType) || 'dark';
const DEFAULT_NIGHT_MODE_INTERVAL = [20 * 3600 * 1000, 8 * 3600 * 1000];

const currentNightTimeJSON = localStorage.getItem('nightTime');
const currentNightTime: number[] = currentNightTimeJSON
  ? (JSON.parse(currentNightTimeJSON) as number[])
  : DEFAULT_NIGHT_MODE_INTERVAL;
const isNightMode = localStorage.getItem('nightMode') === 'true';

localStorage.setItem('theme', defaultTheme);
localStorage.setItem('nightTime', JSON.stringify(currentNightTime));
localStorage.setItem('nightMode', JSON.stringify(isNightMode));

const initialState: ThemeState = {
  theme: defaultTheme,
  isNightMode,
  nightTime: currentNightTime,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme(
      state,
      { payload }: PayloadAction<ThemeType> ) {
      state.theme = payload;
    },
    setNightMode(
      state,
      { payload }: PayloadAction<boolean>
    ){
      state.isNightMode = payload
    },
    setNightTime(
      state,
      {payload}: PayloadAction<number[]>
    ){
      state.nightTime = payload
    }
  },
});

export const {
  setTheme,
  setNightMode,
  setNightTime
} = themeSlice.actions;

export default themeSlice.reducer;
