export const isDateValid = year => {
    if (year > 2025) {
        return false;
    }
    return true;
}

export const getMaximumAndMinimumCorrectedDate = dateString => {
    const dateParts = dateString.split("-");
    let writtenYear = dateParts[0];
    const writtenMonth = dateParts[1];
    const writtenDay = dateParts[2];

    if (parseInt(writtenYear) > 2025)
        writtenYear = 2025;

    return `${writtenYear}-${writtenMonth}-${writtenDay}`;
}