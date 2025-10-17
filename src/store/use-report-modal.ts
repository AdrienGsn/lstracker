import { create } from "zustand";

interface State {
	open: boolean;
}

interface Actions {
	setOpen: (open: boolean) => void;
}

const INITIAL_STATE: State = {
	open: false,
};

export const useReportModal = create<State & Actions>()((set, get) => ({
	open: INITIAL_STATE.open,
	setOpen: (open: boolean) => set({ open }),
}));
