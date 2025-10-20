import { formatarDataParaEnvio, formatarDataParaExibicao } from "../utils";

describe("Utils", () => {
  describe("formatarDataParaExibicao", () => {
    it("converte objeto Date para DD/MM/AAAA", () => {
      const dateObj = new Date(2023, 6, 15);
      const result = formatarDataParaExibicao(dateObj);
      expect(result).toBe("15/07/2023");
    });

    it("Retorna string vazia para entrada inválida", () => {
      expect(formatarDataParaExibicao(null)).toBe("");
      expect(formatarDataParaExibicao(undefined)).toBe("");
      expect(formatarDataParaExibicao("")).toBe("");
    });
  });

  describe("formatarDataParaEnvio", () => {
    it("Converte DD/MM/AAAA para AAAA-MM-DD", () => {
      const br = "15/07/2023";
      const result = formatarDataParaEnvio(br);
      expect(result).toBe("2023-07-15");
    });

    it("Retorna string vazia para entrada inválida", () => {
      expect(formatarDataParaEnvio(null)).toBe("");
      expect(formatarDataParaEnvio(undefined)).toBe("");
      expect(formatarDataParaEnvio("")).toBe("");
    }); 
  });
});
