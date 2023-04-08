const config = {
    "transform": {
        "^.+\\.[t|j]sx?$": "babel-jest"
      },
    testEnvironment:"jsdom",
    verbose: true,
};
module.exports = config;
