import containerQueries from "@tailwindcss/container-queries"
import type { Config } from "tailwindcss"
import tailwindcssAnimate from "tailwindcss-animate"
import defaultTheme from "tailwindcss/defaultTheme"

const config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}"
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		screens: {
			xs: '470px',
			...defaultTheme.screens
		},
		extend: {
			colors: {
				melon: {
					'700': '#00d790'
				},
				grape: {
					'700': '#e73953'
				},
				liqorice: {
					'700': '#2d2d2c'
				}
			},
			fontFamily: {
				'bebas-neue': [
					'var(--font-bebas-neue)'
				],
				lato: [
					'var(--font-lato)'
				],
				inter: [
					'var(--font-inter)'
				]
			},
			keyframes: {
				aurora: {
					from: {
						backgroundPosition: "50% 50%, 50% 50%",
					},
					to: {
						backgroundPosition: "350% 50%, 350% 50%",
					},
				},
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				scroll: {
					'0%': {
						transform: 'translateX(0)'
					},
					'100%': {
						transform: 'translateX(-50%)'
					}
				},
				'scroll-reverse': {
					'0%': {
						transform: 'translateX(-50%)'
					},
					'100%': {
						transform: 'translateX(0)'
					}
				}
			},
			animation: {
				aurora: "aurora 60s linear infinite",
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				scroll: 'scroll 30s linear infinite',
				'scroll-reverse': 'scroll-reverse 30s linear infinite'
			},
			containers: {
				sm: '640px'
			}
		}
	},
	plugins: [tailwindcssAnimate, containerQueries]
} satisfies Config

export default config
