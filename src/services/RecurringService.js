import dayjs from "dayjs";

export default class RecurringService {
  static generateFutureTransactions(recurringTransactions, endDate) {
    let futureTransactions = {};

    // Grab the recurring records for the account.
    let recurring = recurringTransactions.filter(
      (recurring) =>
        (recurring.end_date === null || dayjs(recurring.end_date) > dayjs()) &&
        dayjs(recurring.start_date) < dayjs(endDate)
    );

    for (let r of recurring) {
      let maxEndDate = dayjs(endDate);

      let interval = [
        r.interval.slice(0, r.interval.length - 1),
        r.interval.slice(r.interval.length - 1),
      ];

      if (interval[1] === "D") {
        interval[1] = "day";
      } else if (interval[1] === "W") {
        interval[1] = "week";
      } else if (interval[1] === "M") {
        interval[1] = "month";
      } else if (interval[1] === "Y") {
        interval[1] = "year";
      } else {
        // Invalid interval type, let's continue
        continue;
      }

      // If there's an end date, let's determine when we should stop generating transactions (either requested end date or the recurring end date)
      if (r.end_date !== null && dayjs(r.end_date).isBefore(maxEndDate)) {
        maxEndDate = dayjs(r.end_date);
      }

      for (
        let currentDate = dayjs(r.start_date);
        currentDate.isBefore(maxEndDate);
        currentDate = currentDate.add(interval[0], interval[1])
      ) {
        if (currentDate < dayjs()) {
          continue;
        }

        let iso = currentDate.format("YYYY-MM-DD");
        if (!futureTransactions[iso]) {
          futureTransactions[iso] = [];
        }

        futureTransactions[iso].push({
          account_id: r.account_id,
          date: iso,
          description: r.description,
          type: r.type,
          amount: r.amount,
          vendors: r.vendors,
        });
      }
    }

    return futureTransactions;
  }

  static generateFutureTransactionsForMultipleAccounts(accountIds, endDate) {
    let futureTransactions = {};

    let recurring = [];

    // accountIds.forEach((accountId) => {
    //   // Grab the recurring records for the account.
    //   let accountRecurring = Object.values(
    //     accountStore.getAccount(accountId).recurring
    //   ).filter(
    //     (recurring) =>
    //       (recurring.end_date === null ||
    //         dayjs(recurring.end_date) > dayjs()) &&
    //       dayjs(recurring.start_date) < dayjs(endDate)
    //   );
    //   recurring = [...recurring, ...accountRecurring];
    // });

    for (let r of recurring) {
      let maxEndDate = dayjs(endDate);

      let interval = [
        r.interval.slice(0, r.interval.length - 1),
        r.interval.slice(r.interval.length - 1),
      ];

      if (interval[1] === "D") {
        interval[1] = "day";
      } else if (interval[1] === "W") {
        interval[1] = "week";
      } else if (interval[1] === "M") {
        interval[1] = "month";
      } else if (interval[1] === "Y") {
        interval[1] = "year";
      } else {
        // Invalid interval type, let's continue
        continue;
      }

      // If there's an end date, let's determine when we should stop generating transactions (either requested end date or the recurring end date)
      if (r.end_date !== null && dayjs(r.end_date).isBefore(maxEndDate)) {
        maxEndDate = dayjs(r.end_date);
      }

      for (
        let currentDate = dayjs(r.start_date);
        currentDate.isBefore(maxEndDate);
        currentDate = currentDate.add(interval[0], interval[1])
      ) {
        if (currentDate < dayjs()) {
          continue;
        }

        let iso = currentDate.format("YYYY-MM-DD");
        if (!futureTransactions[iso]) {
          futureTransactions[iso] = [];
        }

        futureTransactions[iso].push({
          account_id: r.account_id,
          date: iso,
          description: r.description,
          type: r.type,
          amount: r.amount,
          vendor: r.vendor,
        });
      }
    }

    return futureTransactions;
  }

  static generateAnnualCashFlow(recurring) {
    let annualCashFlow = 0;
    const generateStart = dayjs().startOf("year");
    const generateEnd = dayjs().endOf("year");

    // Grab the recurring records for the account.
    recurring = recurring.filter(
      (recurring) =>
        (recurring.end_date === null ||
          dayjs(recurring.end_date) > generateStart) &&
        dayjs(recurring.start_date) < generateEnd
    );

    for (let r of recurring) {
      let maxEndDate = generateEnd;

      let interval = [
        r.interval.slice(0, r.interval.length - 1),
        r.interval.slice(r.interval.length - 1),
      ];

      if (interval[1] === "D") {
        interval[1] = "day";
      } else if (interval[1] === "W") {
        interval[1] = "week";
      } else if (interval[1] === "M") {
        interval[1] = "month";
      } else if (interval[1] === "Y") {
        interval[1] = "year";
      } else {
        // Invalid interval type, let's continue
        continue;
      }

      // If there's an end date, let's determine when we should stop generating transactions (either requested end date or the recurring end date)
      if (r.end_date !== null && dayjs(r.end_date).isBefore(maxEndDate)) {
        maxEndDate = dayjs(r.end_date);
      }

      for (
        let currentDate = dayjs(r.start_date);
        currentDate.isBefore(maxEndDate);
        currentDate = currentDate.add(interval[0], interval[1])
      ) {
        if (currentDate < generateStart) {
          continue;
        }

        if (r.type === "DEBIT") {
          annualCashFlow -= r.amount;
        } else {
          annualCashFlow += r.amount;
        }
      }
    }

    return annualCashFlow;
  }
}
