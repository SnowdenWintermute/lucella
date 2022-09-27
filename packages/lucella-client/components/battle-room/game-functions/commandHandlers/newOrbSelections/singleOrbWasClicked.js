module.exports = (orbHasBeenSelectedByDirectClick) => {
  if (!orbHasBeenSelectedByDirectClick.current) {
    orbHasBeenSelectedByDirectClick.current = true;
    return true;
  } else return false
}