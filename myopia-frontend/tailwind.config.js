/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				mint: {
					100: "#E6F8F5", // Light mint
					300: "#AEE6DC", // Softer mint
					500: "#5CCDB7", // Default mint
					600: "#4CB9A3", // Darker mint
					900: "#2F6F63", // Deep mint green
			},
		
		},
		},
	},
	plugins: [],
};
