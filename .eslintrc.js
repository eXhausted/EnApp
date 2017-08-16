module.exports = {
    "extends": "airbnb",
    "parser": "babel-eslint",
    "plugins": [
        "react",
        "react-native",
        "jsx-a11y",
        "import",
        "babel"
    ],
    "rules": {
        "max-len": ["error", 150],
        "react/jsx-filename-extension": ["error", { "extensions": [".js"] }],
        "indent": [2, 4],
        'react/jsx-indent-props': ['error', 4],
        'react/jsx-indent': ['error', 4],
    },
};