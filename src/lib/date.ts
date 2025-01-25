// gpt ahh code

const isMonthFirst = (dateStr: string): boolean => {
    return dateStr.includes('-');
};

const ensureFourDigitYear = (year: string): string => {
    return year.length === 2 ? `20${year}` : year;
};

const formatDateString = (day: string, month: string, year: string): string => {
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
};

const parseDateString = (dateStr: string): Date => {
    const ddmmRegex = /^(\d{1,2})[/-](\d{1,2})[/-](\d{2}|\d{4})$/;
    const mmddRegex = /^(\d{1,2})-(\d{1,2})-(\d{2}|\d{4})$/;
    
    const ddmmMatch = dateStr.match(ddmmRegex);
    const mmddMatch = dateStr.match(mmddRegex);
    
    if (!ddmmMatch && !mmddMatch) {
        return new Date(dateStr);
    }
    
    let day: string, month: string, year: string;
    
    if (isMonthFirst(dateStr)) {
        [month, day, year] = mmddMatch!;
        year = ensureFourDigitYear(year);
        dateStr = formatDateString(day, month, year);
    } else {
        [day, month, year] = ddmmMatch!;
        year = ensureFourDigitYear(year);
        dateStr = formatDateString(day, month, year);
    }
    
    const [d, m, y] = dateStr.split('/');
    const dateValue = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    
    return dateValue;
};

export default parseDateString;