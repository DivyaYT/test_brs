export const REQUIRED_HEADERS = (type) => {
  switch (type) {
    case "AP":
      return [
        "CHECK_RECEIPT_NUMBER",
        "GL_DATE",
        "CMC_NO",
        "VENDOR_NAME",
        "RECEIPTS",
        "PAYMENTS",
      ];

    case "GL":
      return [
        // "AE_HEADER_ID",
        "MONTH",
        "INVOICE_NUMBER",
        "NAME",
        "CMC_NO",
        "CMC_NAME",
        "ACCOUNTED_DR",
        "ACCOUNTED_CR",
      ];

    case "BRS":
      return [
        "TRANSFER_DATE",
        "INVOICE_NUMBER",
        "TRANSFER_NAME",
        "WITHDRAWALS",
        "DEPOSITS",
        "BALANCE",
      ];
    default:
      return [];
  }
};
