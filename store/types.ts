import { PersonalSlice } from './slices/personalSlice';
import { ToastSlice } from "./slices/toastSlice";
import { AppSlice } from "./slices/appSlice";
import { SettingsSlice } from "./slices/settingsSlice";
import { DialogSlice } from "./slices/dialogSlice";

export type StoreState = ToastSlice & AppSlice & SettingsSlice & DialogSlice & PersonalSlice;