export function generateUID() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function TomanPriceFormatter(price: string) {

    if (price.length <= 3) return price;

    let priceArr = price.split('');
    let priceArr2 = [];
    let counter = 0;
    for (let i = priceArr.length - 1; i >= 0; i--) {
        priceArr2.push(priceArr[i]);
        counter++;
        if (counter === 3 && i !== 0) {
            priceArr2.push(',');
            counter = 0;
        }
    }

    return priceArr2.reverse().join('');
}

export function TomanPriceToNumber(price: string) {
    return Number(price.replaceAll(',', ''));
}

export const arraysHaveSameValues = (arr1: string[], arr2: string[]) => {
    if (arr1.length !== arr2.length) return false;

    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();

    return sortedArr1.every((value, index) => value === sortedArr2[index]);
};


export const isDateBetween = (date: Date, startDate: Date, endDate: Date) => {
    const dateToCheck = new Date(date);
    dateToCheck.setHours(23)
    dateToCheck.setMinutes(59)
    dateToCheck.setSeconds(59)
    dateToCheck.setMilliseconds(59);

    const start = new Date(startDate);
    start.setHours(0o0)
    start.setMinutes(0o0)
    start.setSeconds(0o0)
    start.setMilliseconds(0o1);

    const end = new Date(endDate);
    end.setHours(0o0)
    end.setMinutes(0o0)
    end.setSeconds(0o0)
    end.setMilliseconds(0o1);

    console.log('date is ', dateToCheck)
    console.log('end date is ', end)

    return dateToCheck >= start && dateToCheck < end;
};
