const FormFields = (type) => {
  switch (type) {
    /* ================= DOC MASTER ================= */
    case "customer":
      return [
        {
          label: "customer_code",
          name: "customer_code",
          type: "text",
          validation: {
            required: "customer_code Type is required",
          },
        },
        {
          label: "customer_name",
          name: "customer_name",
          type: "text",
          validation: {
            required: "customer_name is required",
            minLength: 37,
          },
        },
        { label: "classification", name: "classification", type: "number" },
        { label: "mobile", name: "mobile", type: "number" },
        { label: "email", name: "email", type: "text" },
      ];

    /* ================= ORGANIZATION ================= */
    case "organization":
      return [
        // ===== BASIC =====

        {
          label: "Organization Code",
          name: "orgCode",
          type: "text",
          validation: {
            required: "Organization Code is required",
          },
        },

        {
          label: "Organization Name",
          name: "orgName",
          type: "text",
          validation: {
            required: "Organization Name is required",
          },
        },

        { label: "Short Name", name: "shortName", type: "text" },

        // ===== DATE =====
        { label: "Effective From", name: "effectiveFrom", type: "date" },
        { label: "Effective To", name: "effectiveTo", type: "date" },

        // ===== BUSINESS =====
        { label: "Industry", name: "industry", type: "text" },

        {
          label: "Currency",
          name: "currency",
          type: "select", // better than text
        },

        {
          label: "Status",
          name: "status",
          type: "select",
          validation: {
            required: "Status is required",
          },
        },

        // ===== CONTACT =====
        { label: "Landline No", name: "landlineNo", type: "text" },

        {
          label: "Mobile No",
          name: "mobileNo",
          type: "number",
          validation: {
            required: "Mobile No is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Enter valid 10 digit mobile number",
            },
          },
        },

        {
          label: "Email",
          name: "email",
          type: "email",
          validation: {
            required: "Email is required",
          },
        },

        { label: "Website", name: "website", type: "text" },
        { label: "LinkedIn", name: "linkedin", type: "text" },
        { label: "Twitter", name: "twitter", type: "text" },

        // ===== ADDRESS =====
        { label: "Address", name: "address", type: "textarea" },

        { label: "Country", name: "countryId", type: "select" },
        { label: "State", name: "stateId", type: "select" },
        { label: "City", name: "cityId", type: "select" },

        // ===== BANK =====
        { label: "Bank Name", name: "bankName", type: "text" },
        { label: "Branch Name", name: "branchName", type: "text" },

        {
          label: "IFSC Code",
          name: "ifscCode",
          type: "text",
          validation: {
            pattern: {
              value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
              message: "Invalid IFSC Code",
            },
          },
        },

        { label: "Account No", name: "accNo", type: "text" },
        { label: "Account Holder", name: "accHolder", type: "text" },

        // ===== SYSTEM =====
        { label: "No of Users", name: "noofUsers", type: "number" },
        { label: "Modules", name: "modules", type: "text" },

        // ===== LEGAL =====
        { label: "Registration No", name: "regNo", type: "text" },
        { label: "Registration Place", name: "regPlace", type: "text" },

        {
          label: "PAN No",
          name: "panNo",
          type: "text",
          validation: {
            pattern: {
              value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
              message: "Invalid PAN Number",
            },
          },
        },

        {
          label: "GSTIN",
          name: "gstin",
          type: "text",
          validation: {
            pattern: {
              value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z1-9]{1}Z[0-9A-Z]{1}$/,
              message: "Invalid GSTIN",
            },
          },
        },

        // ===== FILE =====
        { label: "Logo", name: "logo", type: "file" },

        // optional hidden / system fields
        { label: "Logo MIME", name: "logoMime", type: "hidden" },
        { label: "Logo Filename", name: "logoFilename", type: "hidden" },
        { label: "Logo URL", name: "logoUrl", type: "text" },
      ];
    /* ================= PROJECT ================= */
    case "project":
      return [
        { label: "Project ID", name: "projectId", type: "text" },

        {
          label: "Project Name",
          name: "projectName",
          type: "text",
          validation: {
            required: "Project name is required",
          },
        },
        { label: "Proposal ID", name: "proposalId", type: "text" },
        {
          label: "Project Number",
          name: "projectNo",
          type: "text",
          validation: {
            required: "Project Number is required",
            minLength: 3,
          },
        },

        { label: "Prospect ID", name: "prospectId", type: "text" },
        { label: "Customer ID", name: "customerId", type: "select" },

        { label: "Start Date", name: "startDate", type: "date" },
        { label: "End Date", name: "endDate", type: "date" },
        { label: "Closure Date", name: "closureDate", type: "date" },

        { label: "Currency", name: "currencyId", type: "select" },
        { label: "Contact Person", name: "contactPerson", type: "text" },
        { label: "Sales Rep", name: "salesRep", type: "text" },
        { label: "Assign To", name: "assignTo", type: "text" },

        { label: "Status", name: "status", type: "select" },
      ];

    /* ================= USER ================= */
    case "user":
      return [
        { label: "User ID", name: "userId", type: "text" },
        { label: "User Code", name: "userCode", type: "text" },

        {
          label: "User Name",
          name: "userName",
          type: "text",
          validation: {
            required: "User name is required",
          },
        },
        {
          label: "Mobile No",
          name: "mobNo",
          type: "text",
          validation: {
            required: "Mobile is required",
            minLength: 10,
          },
        },
        {
          label: "Email",
          name: "mailId",
          type: "email",
          validation: {
            required: "Email is required",
            minLength: 3,
          },
        },

        { label: "Role", name: "role", type: "select" },
        { label: "Status", name: "status", type: "select" },

        {
          label: "Password",
          name: "password",
          type: "password",
          validation: {
            required: "Password is required",
            minLength: 5,
          },
        },
        {
          label: "Confirm Password",
          name: "conPassword",
          type: "password",
          validation: {
            required: "Confirm Password is required",
            minLength: 5,
          },
        },

        { label: "Effective From", name: "effFrom", type: "date" },
        { label: "Effective To", name: "effTo", type: "date" },

        { label: "Attachment", name: "attach", type: "file" },
        { label: "File Name", name: "fileName", type: "text" },
        { label: "MIME Type", name: "mimeType", type: "text" },
      ];

    /* ================= DEPARTMENT ================= */
    case "department":
      return [
        { label: "Department ID", name: "deptId", type: "text" },
        {
          label: "Department Code",
          name: "deptCode",
          type: "text",
        },
        {
          label: "Department Name",
          name: "deptName",
          type: "text",
          validation: {
            required: "Department name is required",
          },
        },
        { label: "Status", name: "status", type: "select" },
        { label: "Notes", name: "notes", type: "text" },
      ];

    /* ================= STATUS ================= */
    case "status":
      return [
        {
          label: "Status Code",
          name: "statusCode",
          type: "text",
        },
        {
          label: "Status Name",
          name: "statusName",
          type: "text",
          validation: { required: "Status Name is required" },
        },
        { label: "Description", name: "description", type: "text" },
        { label: "Purpose", name: "purpose", type: "text" },
        { label: "Notes", name: "notes", type: "text" },
        { label: "Color", name: "color", type: "color" },
      ];

    /* ================= ROLE ================= */
    case "role":
      return [
        {
          label: "Role Code",
          name: "roleCode",
          type: "text",
          validation: { required: "Role Code is required" },
        },
        {
          label: "Role Name",
          name: "roleName",
          type: "text",
          validation: { required: "Role Name is required" },
        },
        { label: "Description", name: "description", type: "text" },
        { label: "Purpose", name: "purpose", type: "text" },
        { label: "Notes", name: "notes", type: "text" },
      ];

    /* ================= VENDOR TYPE ================= */
    case "vendorType":
      return [
        { label: "Vendor Type No", name: "vTypeNo", type: "text" },
        {
          label: "Vendor Type",
          name: "vendorType",
          type: "text",
          validation: { required: "Vendor Type is required" },
        },
      ];

    /* ================= VENDOR CLASSIFICATION ================= */
    case "vendorClassification":
      return [
        {
          label: "Classification Code",
          name: "clCode",
          type: "text",
          validation: { required: "Classification Code is required" },
        },
        {
          label: "Classification Name",
          name: "clName",
          type: "text",
          validation: { required: "Classification Name is required" },
        },
      ];

    /* ================= TAX GROUP ================= */
    case "taxGroup":
      return [
        {
          label: "Group Code",
          name: "groupCode",
          type: "text",
          validation: { required: "Group Code is required" },
        },
        {
          label: "Tax Name",
          name: "taxName",
          type: "text",
          validation: { required: "Tax Name is required" },
        },
        { label: "Tax Type", name: "taxType", type: "select" },
        { label: "Tax %", name: "taxPer", type: "number" },
        { label: "Flat Amount", name: "flatAmt", type: "number" },
        { label: "GST %", name: "gst", type: "number" },
        { label: "CGST %", name: "cgst", type: "number" },
        { label: "SGST %", name: "sgst", type: "number" },
        { label: "IGST %", name: "igst", type: "number" },
        { label: "UTGST %", name: "utgst", type: "number" },
        { label: "Status", name: "status", type: "select" },
      ];

    /* ================= TAX COMPONENTS ================= */
    case "taxComponents":
      return [
        {
          label: "Component Code",
          name: "componentCode",
          type: "text",
          validation: { required: "Component Code is required" },
        },
        {
          label: "Component Name",
          name: "componentName",
          type: "text",
          validation: { required: "Component Name is required" },
        },
      ];

    /* ================= PO DESPATCH ================= */
    case "poDespatch":
      return [
        {
          label: "Despatch Code",
          name: "despatchCode",
          type: "text",
          validation: { required: "Despatch Code is required" },
        },
        {
          label: "Despatch Name",
          name: "despatchName",
          type: "text",
          validation: { required: "Despatch Name is required" },
        },
      ];

    /* ================= PO PAYMENT TERMS ================= */
    case "poPaymentTerms":
      return [
        {
          label: "Payment Term Code",
          name: "paytermCode",
          type: "text",
          validation: { required: "Payment Term Code is required" },
        },
        {
          label: "Payment Term Name",
          name: "payTermName",
          type: "text",
          validation: { required: "Payment Term Name is required" },
        },
        { label: "Term Type", name: "payTermType", type: "select" },
        { label: "Days", name: "days", type: "number" },
        { label: "Months", name: "months", type: "number" },
        { label: "Description", name: "termDesc", type: "text" },
        { label: "Status", name: "status", type: "select" },
      ];

    /* ================= INVENTORY ITEM MASTER ================= */
    case "invItemMaster":
      return [
        {
          label: "Item Code",
          name: "itemCode",
          type: "text",
          validation: { required: "Item Code is required" },
        },
        { label: "Item Short Name", name: "itemShortName", type: "text" },
        { label: "Item Description", name: "itemDesc", type: "text" },
        { label: "Reference Part No", name: "refPartNo", type: "text" },
        { label: "Status", name: "status", type: "select" },
        { label: "Item Type", name: "itemType", type: "select" },
        { label: "Material Type", name: "materialType", type: "select" },
        { label: "Category", name: "category", type: "select" },
        { label: "HSN No", name: "hsnNo", type: "text" },
        { label: "Effective From", name: "effFrom", type: "date" },
        { label: "Effective To", name: "effTo", type: "date" },
        { label: "Primary UOM", name: "primaryUom", type: "select" },
        { label: "Warehouse", name: "warehouse", type: "select" },
        { label: "Attachment", name: "attachment", type: "file" },
      ];

    /* ================= INVENTORY UOM ================= */
    case "invUom":
      return [
        {
          label: "UOM Code",
          name: "uomCode",
          type: "text",
          validation: { required: "UOM Code is required" },
        },
        {
          label: "UOM Name",
          name: "uomName",
          type: "text",
          validation: { required: "UOM Name is required" },
        },
        { label: "Description", name: "descrp", type: "text" },
      ];

    /* ================= INV UOM CONVERSION ================= */
    case "invUomConversion":
      return [
        {
          label: "Conversion Code",
          name: "conCode",
          type: "text",
          validation: { required: "Conversion Code is required" },
        },
        {
          label: "Conversion Name",
          name: "conName",
          type: "text",
          validation: { required: "Conversion Name is required" },
        },
        { label: "Item", name: "itemId", type: "select" },
        {
          label: "From UOM",
          name: "fromUom",
          type: "select",
          validation: { required: "From UOM is required" },
        },
        {
          label: "To UOM",
          name: "toUom",
          type: "select",
          validation: { required: "To UOM is required" },
        },
        {
          label: "Multiplier",
          name: "multiplier",
          type: "number",
          validation: { required: "Multiplier is required" },
        },
        { label: "Status", name: "status", type: "select" },
        { label: "Description", name: "descr", type: "text" },
      ];

    /* ================= INVENTORY LOCATION ================= */
    case "invLocation":
      return [
        {
          label: "Location Code",
          name: "locationCode",
          type: "text",
          validation: { required: "Location Code is required" },
        },
        {
          label: "Location Name",
          name: "locationName",
          type: "text",
          validation: { required: "Location Name is required" },
        },
        { label: "Location Type", name: "locationType", type: "select" },
        { label: "Status", name: "status", type: "select" },
        { label: "Inactive Date", name: "inactiveDate", type: "date" },
        { label: "Description", name: "description", type: "text" },

        { label: "Door No", name: "doorNo", type: "text" },
        { label: "Building Name", name: "buildingName", type: "text" },
        { label: "Lane", name: "lane", type: "text" },
        { label: "Area", name: "area", type: "text" },

        { label: "Country", name: "countryId", type: "select" },
        { label: "State", name: "stateId", type: "select" },
        { label: "City", name: "cityId", type: "select" },
        { label: "Address", name: "address", type: "text" },

        { label: "Landline", name: "landline", type: "text" },
        { label: "Mobile No", name: "mobileNo", type: "text" },
        { label: "Email", name: "email", type: "email" },
        { label: "Contact Person", name: "contact", type: "text" },

        { label: "Attachment", name: "attach", type: "file" },
      ];

    /* ================= INVENTORY WAREHOUSE ================= */
    case "invWarehouseDtls":
      return [
        {
          label: "Warehouse Code",
          name: "whCode",
          type: "text",
          validation: { required: "Warehouse Code is required" },
        },
        {
          label: "Warehouse Name",
          name: "whName",
          type: "text",
          validation: { required: "Warehouse Name is required" },
        },
        { label: "Location", name: "locationId", type: "select" },
        { label: "Warehouse Type", name: "whType", type: "select" },
        { label: "Status", name: "status", type: "select" },

        { label: "Effective From", name: "effFrom", type: "date" },
        { label: "Effective To", name: "effTo", type: "date" },
        { label: "Description", name: "description", type: "text" },

        { label: "Landline", name: "landline", type: "text" },
        { label: "Mobile", name: "mob", type: "text" },
        { label: "Email", name: "email", type: "email" },

        { label: "Contact Person 1", name: "cperson1", type: "text" },
        { label: "Contact Mobile 1", name: "cmob1", type: "text" },
        { label: "Contact Email 1", name: "cemail1", type: "email" },

        { label: "Contact Person 2", name: "cperson2", type: "text" },
        { label: "Contact Mobile 2", name: "cmob2", type: "text" },
        { label: "Contact Email 2", name: "cemail2", type: "email" },

        { label: "Attachment", name: "attach", type: "file" },
      ];

    /* ================= INVENTORY LOCATOR ================= */
    case "invLocator":
      return [
        {
          label: "Locator Code",
          name: "locCode",
          type: "text",
          validation: { required: "Locator Code is required" },
        },
        {
          label: "Locator Name",
          name: "locName",
          type: "text",
          validation: { required: "Locator Name is required" },
        },
        { label: "Warehouse", name: "whId", type: "select" },
        { label: "Locator Type", name: "locType", type: "select" },
        { label: "Status", name: "status", type: "select" },

        { label: "Row", name: "roww", type: "text" },
        { label: "Rack", name: "rack", type: "text" },
        { label: "Shelf", name: "shelf", type: "text" },
        { label: "Bin", name: "bin", type: "text" },

        { label: "Bin Quantity", name: "binQty", type: "number" },
        { label: "Max Quantity", name: "maxQty", type: "number" },

        { label: "Effective From", name: "effFrom", type: "date" },
        { label: "Effective To", name: "effTo", type: "date" },
        { label: "Description", name: "locDesc", type: "text" },
      ];

    /* ================= INVENTORY LOCATOR TYPE ================= */
    case "invLocatorType":
      return [
        {
          label: "Locator Code",
          name: "locCode",
          type: "text",
          validation: { required: "Locator Code is required" },
        },
        {
          label: "Locator Type",
          name: "locType",
          type: "text",
          validation: { required: "Locator Type is required" },
        },
      ];

    /* ================= INVENTORY ITEM TYPE ================= */
    case "invItemType":
      return [
        { label: "Item Code No", name: "itemCodeNo", type: "text" },
        {
          label: "Item Type",
          name: "itemType",
          type: "text",
          validation: { required: "Item Type is required" },
        },
      ];

    /* ================= INVENTORY MATERIAL TYPE ================= */
    case "invMaterialType":
      return [
        { label: "Material Code No", name: "matCodeNo", type: "text" },
        {
          label: "Material Type",
          name: "materialType",
          type: "text",
          validation: { required: "Material Type is required" },
        },
      ];

    /* ================= INVENTORY ITEM CATEGORY ================= */
    case "invItemCategory":
      return [
        { label: "Category No", name: "catNo", type: "text" },
        {
          label: "Category Name",
          name: "categoryName",
          type: "text",
          validation: { required: "Category Name is required" },
        },
      ];

    /* ================= INVENTORY TAX MAPPING ================= */
    case "invTaxMapping":
      return [
        {
          label: "Mapping No",
          name: "mapNo",
          type: "text",
          validation: { required: "Mapping No is required" },
        },
        { label: "Tax", name: "taxId", type: "select" },
        { label: "Item", name: "itemId", type: "select" },
        { label: "Category", name: "category", type: "select" },
        { label: "Status", name: "status", type: "select" },
      ];

    /* ================= CATEGORY ================= */
    case "category":
      return [
        {
          label: "Category Name",
          name: "name",
          type: "text",
          validation: { required: "Category Name is required" },
        },
        { label: "Description", name: "description", type: "text" },
      ];

    default:
      return [];
  }
};

export default FormFields;
