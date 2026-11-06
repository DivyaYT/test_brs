export const REQUIRED_HEADERS = (type) => {
  switch (type) {
    case "AP":
      return {
        headers: [
          "CHECK_RECEIPT_NUMBER",
          "GL_DATE",
          "CMC_NO",
          "VENDOR_NAME",
          "RECEIPTS",
          "PAYMENTS",
        ],
        types: {
          CHECK_RECEIPT_NUMBER: "string",
          GL_DATE: "date",
          CMC_NO: "string",
          VENDOR_NAME: "string",
          RECEIPTS: "number",
          PAYMENTS: "number",
        },
      };

    case "GL":
      return {
        headers: [
          "MONTH",
          "INVOICE_NUMBER",
          "NAME",
          "CMC_NO",
          "CMC_NAME",
          "ACCOUNTED_DR",
          "ACCOUNTED_CR",
        ],
        types: {
          MONTH: "string",
          INVOICE_NUMBER: "string",
          NAME: "string",
          CMC_NO: "string",
          CMC_NAME: "string",
          ACCOUNTED_DR: "number",
          ACCOUNTED_CR: "number",
        },
      };

    case "BANK":
      return {
        headers: [
          "TRANSFER_DATE",
          "INVOICE_NUMBER",
          "TRANSFER_NAME",
          "WITHDRAWALS",
          "DEPOSITS",
          "BALANCE",
        ],
        types: {
          TRANSFER_DATE: "date",
          INVOICE_NUMBER: "string",
          TRANSFER_NAME: "string",
          WITHDRAWALS: "number",
          DEPOSITS: "number",
          BALANCE: "number",
        },
      };

    default:
      return {
        headers: [],
        types: {},
      };
  }
};
