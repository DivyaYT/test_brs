"use client";
import { useState } from "react";

export default function FormState(type, options = {}) {
  const {
    editData = null,
    created = null,
    toDate = null,
    orgId = null,
    userId = null,
  } = options;

  let initialState = {};

  switch (type) {
    case "customer":
      initialState = {
        customer_code: null,
        customer_name: null,
        classification: null,
        mobile: null,
        email: null,
      };

      break;
    case "organization":
      initialState = {
        orgId: null,
        orgCode: null,
        shortName: null,
        orgName: null,
        effectiveFrom: null,
        effectiveTo: null,
        industry: null,
        currency: null,
        status: null,
        landlineNo: null,
        mobileNo: null,
        email: null,
        website: null,
        linkedin: null,
        twitter: null,
        address: null,
        countryId:  null,
        stateId: null,
        cityId: null,
        bankName: null,
        branchName: null,
        ifscCode: null,
        accNo: null,
        accHolder: null,
        noofUsers: null,
        modules: null,
        regNo: null,
        regPlace: null,
        panNo: null,
        gstin: null,
        logo: null,
        logoMime: null,
        logoFilename: null,
        attribute1: null,
        attribute2: null,
        attribute3: null,
        attribute4: null,
        attribute5: null,
        userId: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
      };

      break;
    case "project":
      initialState = {
        projectId: null,
        projectName: null,
        proposalId: null,
        projectNo: null,
        prospectId: null,
        customerId: null,
        startDate: null,
        endDate: null,
        closureDate: null,
        currencyId: null,
        contactPerson: null,
        salesRep: null,
        assignTo: null,
        status: null,
        attribute1: null,
        attribute2: null,
        attribute3: null,
        attribute4: null,
        attribute5: null,
        userId: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
        organizationId: null,
      };
      break;
    case "user":
      initialState = {
        userId: null,
        userCode: null,
        userName: null,
        mobNo: null,
        mailId: null,
        role: null,
        status: null,
        password: null,
        conPassword: null,
        effFrom: null,
        effTo: null,
        attach: null,
        fileName: null,
        mimeType: null,
        attribute1: null,
        attribute2: null,
        attribute3: null,
        attribute4: null,
        attribute5: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
        organizationId: null,
      };
      break;
    case "department":
      initialState = {
        deptId: null,
        deptCode: null,
        deptName: null,
        status: null,
        notes: null,
        attribute1: null,
        attribute2: null,
        attribute3: null,
        attribute4: null,
        attribute5: null,
        userId: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
        organizationId: null,
      };
      break;
    case "status":
      initialState = {
        statusId: null,
        statusCode: null,
        statusName: null,
        description: null,
        purpose: null,
        notes: null,
        color: null,
        attribute1: null,
        attribute2: null,
        attribute3: null,
        attribute4: null,
        attribute5: null,
        userId: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
        organizationId: null,
      };
      break;
    case "role":
      initialState = {
        roleId: null,
        roleCode: null,
        roleName: null,
        description: null,
        purpose: null,
        notes: null,
        attribute1: null,
        attribute2: null,
        attribute3: null,
        attribute4: null,
        attribute5: null,
        userId: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
        organizationId: null,
      };
      break;

    case "vendorType":
      initialState = {
        vTypeNo: null,
        vendorType: null,
        attribute1: null,
        attribute2: null,
        attribute3: null,
        attribute4: null,
        attribute5: null,
        userId: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
        organizationId: null,
      };
      break;
    case "vendorClassification":
      initialState = {
        clId: null,
        clCode: null,
        clName: null,
        attribute1: null,
        attribute2: null,
        attribute3: null,
        attribute4: null,
        attribute5: null,
        userId: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
        organizationId: null,
      };
      break;
    case "taxGroup":
      initialState = {
        taxId: null,
        groupCode: null,
        taxName: null,
        taxType: null,
        taxPer: null,
        flatAmt: null,
        gst: null,
        cgst: null,
        sgst: null,
        igst: null,
        utgst: null,
        status: null,
        attribute1: null,
        attribute2: null,
        attribute3: null,
        attribute4: null,
        attribute5: null,
        userId: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
        organizationId: null,
      };

      break;
    case "taxComponents":
      initialState = {
        componentId: null,
        componentCode: null,
        componentName: null,
        attribute1: null,
        attribute2: null,
        attribute3: null,
        attribute4: null,
        attribute5: null,
        userId: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
        organizationId: null,
      };

      break;
    case "poDespatch":
      initialState = {
        despatchId: null,
        despatchCode: null,
        despatchName: null,
        attribute1: null,
        attribute2: null,
        attribute3: null,
        attribute4: null,
        attribute5: null,
        userId: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
        organizationId: null,
      };

      break;
    case "poPaymentTerms":
      initialState = {
        paytermId: null,
        paytermCode: null,
        payTermName: null,
        payTermType: null,
        days: null,
        months: null,
        termDesc: null,
        status: null,
        attribute1: null,
        attribute2: null,
        attribute3: null,
        attribute4: null,
        attribute5: null,
        userId: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
        organizationId: null,
      };
      break;
    case "invItemMaster":
      initialState = {
        itemId: null,
        itemCode: null,
        itemShortName: null,
        itemDesc: null,
        refPartNo: null,
        status: null,
        itemType: null,
        materialType: null,
        category: null,
        hsnNo: null,
        effFrom: null,
        effTo: null,
        expireyRequired: null,
        qcRequired: null,
        finishedItem: null,
        expiryDate: null,
        primaryUom: null,
        purchaseUom: null,
        stockUom: null,
        salesUom: null,
        productionUom: null,
        warehouse: null,
        locator: null,
        xlDesc: null,
        itmBarCodeNo: null,
        attachment: null,
        mimeType: null,
        fileName: null,
        attribute1: null,
        attribute2: null,
        attribute3: null,
        attribute4: null,
        attribute5: null,
        userId: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
        organizationId: null,
      };

      break;
    case "invUom":
      initialState = {
        uomId: null,
        uomCode: null,
        uomName: null,
        descrp: null,
        attribute1: null,
        attribute2: null,
        attribute3: null,
        attribute4: null,
        attribute5: null,
        userId: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
        organizationId: null,
      };

      break;
    case "invUomConversion":
      initialState = {
        conId: null,
        conCode: null,
        conName: null,
        itemId: null,
        fromUom: null,
        toUom: null,
        multiplier: null,
        status: null,
        descr: null,
        attribute1: null,
        attribute2: null,
        attribute3: null,
        attribute4: null,
        attribute5: null,
        userId: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
        organizationId: null,
      };
      break;
    case "invLocation":
      initialState = {
        locationId: null,
        locationCode: null,
        locationName: null,
        locationType: null,
        status: null,
        inactiveDate: null,
        description: null,
        doorNo: null,
        buildingName: null,
        lane: null,
        area: null,
        countryId: null,
        stateId: null,
        cityId: null,
        address: null,
        landline: null,
        mobileNo: null,
        email: null,
        contact: null,
        attach: null,
        fileName: null,
        mimeType: null,
        attribute1: null,
        attribute2: null,
        attribute3: null,
        attribute4: null,
        attribute5: null,
        userId: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
        organizationId: null,
      };

      break;
    case "invWarehouseDtls":
      initialState = {
        whId: null,
        whCode: null,
        whName: null,
        locationId: null,
        whType: null,
        status: null,
        effFrom: null,
        effTo: null,
        description: null,
        landline: null,
        mob: null,
        email: null,
        cperson1: null,
        cmob1: null,
        cemail1: null,
        cperson2: null,
        cmob2: null,
        cemail2: null,
        attach: null,
        fileName: null,
        mimeType: null,
        attribute1: null,
        attribute2: null,
        attribute3: null,
        attribute4: null,
        attribute5: null,
        userId: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
        organizationId: null,
      };

      break;

    case "invLocator":
      initialState = {
        locatorId: null,
        locId: null,
        whId: null,
        locName: null,
        status: null,
        locCode: null,
        effFrom: null,
        effTo: null,
        locType: null,
        roww: null,
        rack: null,
        shelf: null,
        bin: null,
        binQty: null,
        maxQty: null,
        locDesc: null,
        attribute1: null,
        attribute2: null,
        attribute3: null,
        attribute4: null,
        attribute5: null,
        userId: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
        organizationId: null,
      };
      break;
    case "invLocatorType":
      initialState = {
        locId: null,
        locCode: null,
        locType: null,
        attribute1: null,
        attribute2: null,
        attribute3: null,
        attribute4: null,
        attribute5: null,
        userId: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
        organizationId: null,
      };
      break;
    case "invItemType":
      initialState = {
        itemCodeNo: null,
        itemType: null,
        attribute1: null,
        attribute2: null,
        attribute3: null,
        attribute4: null,
        attribute5: null,
        userId: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
        organizationId: null,
      };

      break;
    case "invMaterialType":
      initialState = {
        matCodeNo: null,
        materialType: null,
        attribute1: null,
        attribute2: null,
        attribute3: null,
        attribute4: null,
        attribute5: null,
        userId: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
        organizationId: null,
      };

      break;
    case "invItemCategory":
      initialState = {
        catNo: null,
        categoryName: null,
        attribute1: null,
        attribute2: null,
        attribute3: null,
        attribute4: null,
        attribute5: null,
        userId: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
        organizationId: null,
      };
      break;
    case "invTaxMapping":
      initialState = {
        mapId: null,
        mapNo: null,
        taxId: null,
        itemId: null,
        category: null,
        status: null,
        attribute1: null,
        attribute2: null,
        attribute3: null,
        attribute4: null,
        attribute5: null,
        userId: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
        organizationId: null,
      };
      break;

    case "category":
      initialState = {
        catId: null,
        name: null,
        description: null,
        userId: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
        organizationId: null,
      };
      break;

    default:
      initialState = {};
      break;
  }

  const [state, setState] = useState(initialState);

  return { state, setState };
}
