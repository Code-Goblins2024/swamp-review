import { create } from "zustand";

const useAuthStore = create((set) => ({
	session: null,
	setSession: (session) => set(() => ({ session })),
}));

const useAuth = () => {
	const { session, setSession } = useAuthStore();
	return { session, setSession };
};

export default useAuth;
