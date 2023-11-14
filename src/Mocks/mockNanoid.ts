jest.mock('nanoid', () => {
  const incrementGenerator = () => {
    let n = 1000000000;

    return function () {
      n++;
      return n.toString();
    };
  };
  return { nanoid: incrementGenerator() };
});
