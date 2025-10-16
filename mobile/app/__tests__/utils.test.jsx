import {
  formatCurrency,
  formatarDataParaExibicao,
  formatarDataParaEnvio,
} from "../utils";

describe("utils", () => {
  describe("formatCurrency", () => {
    it("formata número como moeda BRL", () => {
      const result = formatCurrency(1234.56);
      // A formatação local pode incluir espaço sem quebra, então verificamos partes esperadas
      expect(result).toContain("R$");
      expect(result.replace(/\s/g, "")).toContain("1.234,56");
    });

    it("retorna string vazia para valores não numéricos", () => {
      expect(formatCurrency("abc")).toBe("");
      expect(formatCurrency(null)).toBe("");
      expect(formatCurrency(undefined)).toBe("");
    });
  });

  describe("formatarDataParaExibicao", () => {
    it("converte objeto Date para dd/mm/aaaa (estável quanto ao fuso)", () => {
      // constrói um Date usando componentes locais para evitar deslocamentos por UTC
      const dateObj = new Date(2023, 6, 15); // mês é baseado em 0, 6 = julho
      const result = formatarDataParaExibicao(dateObj);
      expect(result).toBe("15/07/2023");
    });

    it("retorna string vazia para entrada falsy", () => {
      expect(formatarDataParaExibicao(null)).toBe("");
      expect(formatarDataParaExibicao(undefined)).toBe("");
      expect(formatarDataParaExibicao("")).toBe("");
    });
  });

  describe("formatarDataParaEnvio", () => {
    it("converte dd/mm/aaaa para aaaa-mm-dd", () => {
      const br = "05/11/2021";
      expect(formatarDataParaEnvio(br)).toBe("2021-11-05");
    });

    it("retorna string vazia para entrada inválida ou falsy", () => {
      expect(formatarDataParaEnvio(null)).toBe("");
      expect(formatarDataParaEnvio("")).toBe("");
      expect(formatarDataParaEnvio("invalid")).toBe("");
      expect(formatarDataParaEnvio("01/02")).toBe("");
    });
  });
});
