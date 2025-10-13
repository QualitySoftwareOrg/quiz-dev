// Mock for db.query
const mockQuery = jest.fn(async (text, params) => {
  // default empty result
  return { rows: [] };
});

module.exports = { query: mockQuery };
