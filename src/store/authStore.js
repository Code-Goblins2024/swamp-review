import { create } from "zustand";

const useAuthStore = create((set) => ({
	session: null,
	setSession: (session) => set(() => ({ session })),
	publicUser: null,
	setPublicUser: (publicUser) => set(() => ({ publicUser })),
}));

const useAuth = () => {
	const { session, setSession, publicUser, setPublicUser } = useAuthStore();
	return { session, setSession, publicUser, setPublicUser };
};

export default useAuth;
