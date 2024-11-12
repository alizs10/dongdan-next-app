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