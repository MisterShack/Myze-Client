export default class Currency {
  amount: number;

  constructor(amount: number) {
    this.amount = amount;
  }

  static createFromString(amountString: string): Currency {
    let [dollars, cents] = amountString.split(".");

    let amount: number = (parseInt(dollars) || 0) * 100;

    if (cents) {
      if (cents.length == 1) {
        amount += parseInt(cents + "0");
      } else {
        amount += parseInt(cents.substr(0, 2));
      }
    }

    return new Currency(amount);
  }

  format(): string {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(this.amount);
  }
}
