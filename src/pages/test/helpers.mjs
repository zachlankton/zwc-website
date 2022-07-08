function loadCustomHelpers(regHelper) {
  regHelper("hello", function () {
    return "Hello from another custom helper!!!";
  });
}

export default loadCustomHelpers;
