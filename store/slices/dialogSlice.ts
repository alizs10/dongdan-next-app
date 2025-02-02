import { StateCreator } from "zustand";

export interface DialogSlice {
    title: string,
    desc: string,
    okText: string,
    cancelText: string,
    onOk: () => void,
    onCancel: () => void,
    isOpen: boolean,
    openDialog: (title: string, desc: string, buttons: { ok: { text: string, onClick: () => void }, cancel: { text: string, onClick: () => void } }) => void,
    closeDialog: () => void,
}

type InitStateType = Omit<DialogSlice, 'openDialog' | 'closeDialog'>;

const initState: InitStateType = {
    title: 'Dialog Title',
    desc: 'Dialog Description',
    okText: 'Ok',
    cancelText: 'Cancel',
    onOk: () => { },
    onCancel: () => { },
    isOpen: false,
}

export const createDialogSlice: StateCreator<DialogSlice, [], [], DialogSlice> = (set) => ({
    title: initState.title,
    desc: initState.desc,
    okText: initState.okText,
    cancelText: initState.cancelText,
    onOk: initState.onOk,
    onCancel: initState.onCancel,
    isOpen: initState.isOpen,
    openDialog: (title, desc, buttons) => set({ isOpen: true, title, desc, okText: buttons.ok.text, cancelText: buttons.cancel.text, onOk: buttons.ok.onClick, onCancel: buttons.cancel.onClick }),
    closeDialog: () => set({ ...initState }),
})