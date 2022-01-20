module.exports = {
  mode: "jit",
  content: ["pages/**/*.js", "Components/**/*.js"],
  corePlugins: {
    preflight: false,
  },
  prefix: "tw-",
  theme: {
    extend: {
      colors: {
        "yikes": "rgba(255, 255, 255, 0.60)",
      },
    },
  },
  variants: {},
  plugins: [],
  darkmode: "media",
};
