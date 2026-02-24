export function formatarDataParaExibicao(dataISO) {
    if (!dataISO) return '';
    if (typeof dataISO === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dataISO)) {
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano}`;
    }
    const data = new Date(dataISO);
    if (Number.isNaN(data.getTime())) return '';
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

export function formatarDataParaEnvio(dataBR) {
    if (!dataBR) return '';
    const [dia, mes, ano] = dataBR.split('/');
    if (!dia || !mes || !ano) return '';
    return `${ano}-${mes}-${dia}`;
}

