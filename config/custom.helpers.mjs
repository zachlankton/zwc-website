function loadCustomHelpers(regHelper) {
  regHelper("customHelper", function () {
    return "I came from a custom helper!";
  });
}

export default loadCustomHelpers;
