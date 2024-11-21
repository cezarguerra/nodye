export const normalizePhoneNumber = (
  value: string | undefined | null
): string => {
  if (!value) return "";

  const digits = value.replace(/[\D]/g, ""); // Remove todos os caracteres não numéricos

  if (digits.length === 11) {
    // Caso para números com 11 dígitos
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (digits.length < 11) {
    // Caso para números com menos de 11 dígitos
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  } else {
    // Caso para números com mais de 11 dígitos
    return ""; // Retorna uma string vazia
  }
};

export const normalizeCnpjNumber = (value: string | undefined | null) => {
  if (!value) return "";

  return value
    .replace(/[\D]/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};
export const normalizeCpfNumber = (value: string | undefined | null) => {
  if (!value) return "";

  return value
    .replace(/[\D]/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

export const normalizeCepNumber = (value: string | undefined | null) => {
  if (!value) return "";

  const digits = value.replace(/[\D]/g, "");

  if (digits.length === 8) {
    // Caso para números com 8 dígitos
    return digits.replace(/^(\d{5})(\d{3})$/, "$1-$2");
  } else if (digits.length > 5 && digits.length < 8) {
    // Caso para números com mais de 5 e menos de 8 dígitos
    return digits.replace(/^(\d{5})(\d{1,3})$/, "$1-$2");
  } else if (digits.length <= 5) {
    // Caso para números com 5 dígitos ou menos
    return digits;
  } else {
    // Caso para números com mais de 8 dígitos
    return ""; // Retorna uma string vazia
  }
};

export function onlyNumbers(value: string): string {
  return value.replace(/\D/g, "");
}
