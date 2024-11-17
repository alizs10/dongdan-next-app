import { create } from "zustand";

type DialogState = {
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

type InitSateType = Omit<DialogState, 'openDialog' | 'closeDialog'>;

const initState: InitSateType = {
    title: 'Dialog Title',
    desc: 'Dialog Description',
    okText: 'Ok',
    cancelText: 'Cancel',
    onOk: () => { },
    onCancel: () => { },
    isOpen: false,
}

export const useDialogStore = create<DialogState>((set) => ({

    title: initState.title,
    desc: initState.desc,
    okText: initState.okText,
    cancelText: initState.cancelText,
    onOk: initState.onOk,
    onCancel: initState.onCancel,
    isOpen: initState.isOpen,
    openDialog: (title, desc, buttons) => set({ isOpen: true, title, desc, okText: buttons.ok.text, cancelText: buttons.cancel.text, onOk: buttons.ok.onClick, onCancel: buttons.cancel.onClick }),
    closeDialog: () => set({ ...initState }),

}))