export default [
    {
        ignores: ["verification/**/*.js"]
    },
    {
        files: ["js/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },
        rules: {
            "semi": "error"
        }
    }
];
