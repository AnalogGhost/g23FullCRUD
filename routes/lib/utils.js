
function flatten(input) {
  return Promise.resolve(Array.isArray(input) ? input[0] : input);
}

module.exports = {
  flatten: flatten
};
