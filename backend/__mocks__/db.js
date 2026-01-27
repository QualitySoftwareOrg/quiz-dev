// Mock para db.query
const mockQuery = jest.fn(async (text, params) => {
  // resultado vazio padrão
  return { rows: [] };
});

module.exports = { query: mockQuery };
