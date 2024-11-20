import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
		define: {
			'process.env.OPEN_MODERATOR_API_KEY': JSON.stringify(env.OPEN_MODERATOR_API_KEY)
		},
		plugins: [react()],
		test: {
			globals: true,
			environment: "jsdom",
			setupFiles: ["./setupTests.js"],
		},
	}
});
