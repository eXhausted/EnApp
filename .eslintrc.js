module.exports = {
    "extends": "airbnb",
    "parser": "babel-eslint",
    "plugins": [
        "react",
        "react-native",
        "jsx-a11y",
        "import"
    ],
    "rules": {
        "max-len": ["error", 150],
        "indent": ["error", 4],
        "react/jsx-indent": ["error", 4],
        "react/jsx-filename-extension": ["error", { "extensions": [".js"] }]
    },
};