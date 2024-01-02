function setPropertyRequired(attributeName, boolValue = true) {
  //обов"язкове
  var attributeProps = EdocsApi.getControlProperties(attributeName);
  attributeProps.required = boolValue;
  EdocsApi.setControlProperties(attributeProps);
}

function setPropertyHidden(attributeName, boolValue = true) {
  //приховане
  var attributeProps = EdocsApi.getControlProperties(attributeName);
  attributeProps.hidden = boolValue;
  EdocsApi.setControlProperties(attributeProps);
}

function setPropertyDisabled(attributeName, boolValue = true) {
  //недоступне
  var attributeProps = EdocsApi.getControlProperties(attributeName);
  attributeProps.disabled = boolValue;
  EdocsApi.setControlProperties(attributeProps);
}

function setAttrValue(attributeCode, attributeValue) {
  var attribute = EdocsApi.getAttributeValue(attributeCode);
  attribute.value = attributeValue;
  EdocsApi.setAttributeValue(attribute);
}

//Скрипт 1. Автоматичне визначення email ініціатора рахунку та підрозділу
function onCreate() {
  EdocsApi.setAttributeValue({ code: "Branch", value: EdocsApi.getOrgUnitDataByUnitID(EdocsApi.getEmployeeDataByEmployeeID(CurrentDocument.initiatorId).unitId, 1).unitId, text: null });
}

function onSearchBranch(searchRequest) {
  searchRequest.filterCollection.push({
    attributeCode: "SubdivisionLevelDirect",
    value: "1",
  });
}

function onCardInitialize() {
  DefinitionAgreeableTask();
  EnterResultsTask();
  AddDatAndNumberTask();
  //RegisterActTask();
  ProcessActTask();
}
//Скрипт 2. Зміна властивостей атрибутів та автоматичне визначення email ініціатора
function DefinitionAgreeableTask() {
  var stateTask = EdocsApi.getCaseTaskDataByCode("DefinitionAgreeable" + EdocsApi.getAttributeValue("Sections").value)?.state;

  if (stateTask == "assigned" || stateTask == "inProgress" || stateTask == "delegated") {
    EdocsApi.setControlProperties({ code: "SubjectAct", hidden: false, disabled: false, required: true });
    EdocsApi.setControlProperties({ code: "VisaHolder", hidden: false, disabled: false, required: true });
    EdocsApi.setControlProperties({ code: "OrgRPEmail", hidden: false, disabled: false, required: true });
    EdocsApi.setControlProperties({ code: "StructureDepart", hidden: false, disabled: false, required: true });
    EdocsApi.setControlProperties({ code: "ContractorRPEmail", hidden: false, disabled: false, required: true });
    EdocsApi.setControlProperties({ code: "DocKind", hidden: false, disabled: false, required: true });

    EdocsApi.setAttributeValue({ code: "OrgRPEmail", value: EdocsApi.getEmployeeDataByEmployeeID(CurrentDocument.initiatorId).email, text: null });
  } else if (stateTask == "completed") {
    EdocsApi.setControlProperties({ code: "SubjectAct", hidden: false, disabled: true, required: true });
    EdocsApi.setControlProperties({ code: "VisaHolder", hidden: false, disabled: true, required: true });
    EdocsApi.setControlProperties({ code: "OrgRPEmail", hidden: false, disabled: true, required: true });
    EdocsApi.setControlProperties({ code: "StructureDepart", hidden: false, disabled: true, required: true });
    EdocsApi.setControlProperties({ code: "ContractorRPEmail", hidden: false, disabled: true, required: true });
    EdocsApi.setControlProperties({ code: "DocKind", hidden: false, disabled: true, required: true });
  } else {
    EdocsApi.setControlProperties({ code: "SubjectAct", hidden: true, disabled: false, required: false });
    EdocsApi.setControlProperties({ code: "VisaHolder", hidden: true, disabled: false, required: false });
    EdocsApi.setControlProperties({ code: "OrgRPEmail", hidden: true, disabled: false, required: false });
    EdocsApi.setControlProperties({ code: "StructureDepart", hidden: true, disabled: false, required: false });
    EdocsApi.setControlProperties({ code: "ContractorRPEmail", hidden: true, disabled: false, required: false });
    EdocsApi.setControlProperties({ code: "DocKind", hidden: true, disabled: false, required: false });
  }
}

function onTaskExecuteDefinitionAgreeable(routeStage) {
  debugger;
  if (routeStage.executionResult == "executed") {
    if (!EdocsApi.getAttributeValue("SubjectAct").value) throw `Внесіть значення в поле "Предмет акту"`;
    if (!EdocsApi.getAttributeValue("VisaHolder").value) throw `Внесіть значення в поле "погоджуючі"`;
    if (!EdocsApi.getAttributeValue("OrgRPEmail").value) throw `Внесіть значення в поле "email контактної особи Організації"`;
    if (!EdocsApi.getAttributeValue("ContractorRPEmail").value) throw `Внесіть значення в поле "email контактної особи Замовника"`;
  }
}

//Скрипт 3. Зміна властивостей атрибутів

function onTaskExecutedAddProtocol(routeStage) {
  debugger;
  if (routeStage.executionResult == "executed") {
    EnterResultsTask();
  }
}

function EnterResultsTask() {
  debugger;
  var stateTask = EdocsApi.getCaseTaskDataByCode("EnterResults")?.state;

  if (stateTask == "assigned" || stateTask == "inProgress" || stateTask == "delegated") {
    EdocsApi.setControlProperties({ code: "ActMeetingResult", hidden: false, disabled: false, required: true });
    EdocsApi.setControlProperties({ code: "Number", hidden: false, disabled: false, required: true });
    EdocsApi.setControlProperties({ code: "DateProtocol", hidden: false, disabled: false, required: true });
  } else if (stateTask == "completed") {
    EdocsApi.setControlProperties({ code: "ActMeetingResult", hidden: false, disabled: true, required: true });
    EdocsApi.setControlProperties({ code: "Number", hidden: false, disabled: true, required: true });
    EdocsApi.setControlProperties({ code: "DateProtocol", hidden: false, disabled: true, required: true });
  } else {
    EdocsApi.setControlProperties({ code: "ActMeetingResult", hidden: true, disabled: false, required: false });
    EdocsApi.setControlProperties({ code: "Number", hidden: true, disabled: false, required: false });
    EdocsApi.setControlProperties({ code: "DateProtocol", hidden: true, disabled: false, required: false });
  }
}

function onTaskExecutedProtocolAdd() {
  debugger;
  //AddDatAndNumberTask();
  EdocsApi.setControlProperties({ code: "NumberProtocol", hidden: false, disabled: false, required: true });
  EdocsApi.setControlProperties({ code: "Date", hidden: false, disabled: false, required: true });
}

function AddDatAndNumberTask() {
  debugger;
  var stateTask = EdocsApi.getCaseTaskDataByCode("AddDatAndNumber")?.state;

  if (stateTask == "assigned" || stateTask == "inProgress" || stateTask == "delegated") {
    EdocsApi.setControlProperties({ code: "NumberProtocol", hidden: false, disabled: false, required: true });
    EdocsApi.setControlProperties({ code: "Date", hidden: false, disabled: false, required: true });
  } else if (stateTask == "completed") {
    EdocsApi.setControlProperties({ code: "NumberProtocol", hidden: false, disabled: true, required: true });
    EdocsApi.setControlProperties({ code: "Date", hidden: false, disabled: true, required: true });
  } else {
    EdocsApi.setControlProperties({ code: "NumberProtocol", hidden: true, disabled: false, required: false });
    EdocsApi.setControlProperties({ code: "Date", hidden: true, disabled: false, required: false });
  }
}

function onChangeActMeetingResult() {
  if (EdocsApi.getAttributeValue("ActMeetingResult").value == "Погоджено") {
    var stateTask = EdocsApi.getCaseTaskDataByCode("EnterResults")?.state;
    if (stateTask == "assigned" || stateTask == "inProgress" || stateTask == "delegated") {
      EdocsApi.message(
        `Замовнику на підпис будуть відправлені тільки зафіксовані файли. Перевірте наявність позначки «Фіксується» тільки у тих файлах, які необхідно відправити Замовнику. 
Для інших файлів дана позначка має бути відсутня.`
      );
    }
  }
}

function onTaskExecuteEnterResults(routeStage) {
  debugger;
  if (routeStage.executionResult == "executed") {
    if (!EdocsApi.getAttributeValue("ActMeetingResult").value) throw `Внесіть значення в поле "Результат розгляду акту засіданням"`;
    if (!EdocsApi.getAttributeValue("Number").value) throw `Внесіть значення в поле "Номер"`;
  }
}

//Скрипт 5. Визначення ролі за розрізом
function setSections() {
  debugger;
  var Branch = EdocsApi.getAttributeValue("Branch");
  if (Branch.value) {
    var Sections = EdocsApi.getAttributeValue("Sections");
    var BranchData = EdocsApi.getOrgUnitDataByUnitID(Branch.value);
    if (Sections.value != BranchData.unitName) {
      Sections.value = BranchData.unitName;
      EdocsApi.setAttributeValue(Sections);
    }
  }
}

function onChangeBranch() {
  setSections();
}

function onBeforeCardSave() {
  setSections();
}

//Скрипт 6. Передача наказу для ознайомлення  в зовнішню систему
// Відправлення на підпис в зовнішній сервіс eSign договору
//-------------------------------
function setDataForESIGN() {
  debugger;
  var registrationDate = EdocsApi.getAttributeValue("DateProtocol").value;
  var registrationNumber = EdocsApi.getAttributeValue("Number").value;
  var caseType = EdocsApi.getAttributeValue("DocType").value;
  var caseKind = EdocsApi.getAttributeValue("DocKind").text;
  var name = "";
  if (caseKind) {
    name += caseKind;
  } else {
    name += caseType;
  }
  name += " №" + (registrationNumber ? registrationNumber : CurrentDocument.id) + (!registrationDate ? "" : " від " + moment(registrationDate).format("DD.MM.YYYY"));
  doc = {
    DocName: name,
    extSysDocId: CurrentDocument.id,
    ExtSysDocVersion: CurrentDocument.version,
    docType: "ActCommission",
    docDate: registrationDate,
    docNum: registrationNumber,
    File: "",
    parties: [
      {
        taskType: "ToSign",
        taskState: "Done",
        legalEntityCode: EdocsApi.getAttributeValue("OrgCode").value,
        contactPersonEmail: EdocsApi.getAttributeValue("OrgRPEmail").value,
        signatures: [],
      },
      {
        taskType: "ToSign",
        taskState: "NotAssigned",
        legalEntityCode: EdocsApi.getAttributeValue("ContractorCode").value,
        contactPersonEmail: EdocsApi.getAttributeValue("ContractorRPEmail").value,
        expectedSignatures: [],
      },
    ],
    additionalAttributes: [
      {
        code: "docDate",
        type: "dateTime",
        value: registrationDate,
      },
      {
        code: "docNum",
        type: "string",
        value: registrationNumber,
      },
    ],
    sendingSettings: {
      attachFiles: "fixed", //, можна також встановлювати 'firstOnly' - Лише файл із першої зафіксованої вкладки(Головний файл), або 'all' - всі файли, 'fixed' - усі зафіксовані
      attachSignatures: "signatureAndStamp", // -'signatureAndStamp'Типи “Підпис” або “Печатка”, можна також встановити 'all' - усі типи цифрових підписів
    },
  };
  EdocsApi.setAttributeValue({ code: "JSON", value: JSON.stringify(doc) });
}

function onTaskExecuteSendOutDoc(routeStage) {
  debugger;
  if (routeStage.executionResult == "rejected") {
    return;
  }
  setDataForESIGN();
  var idnumber = EdocsApi.getAttributeValue("DocId");
  var methodData = {
    ExtSysDocVersion: CurrentDocument.version,
    extSysDocId: idnumber.value,
  };

  routeStage.externalAPIExecutingParams = {
    externalSystemCode: "ESIGN1", // код зовнішньої системи
    externalSystemMethod: "integration/importDoc", // метод зовнішньої системи
    data: methodData, // дані, що очікує зовнішня система для заданого методу
    executeAsync: true, // виконувати завдання асинхронно
  };
}

function onTaskCommentedSendOutDoc(caseTaskComment) {
  debugger;
  var orgCode = EdocsApi.getAttributeValue("OrgCode").value;
  var orgShortName = EdocsApi.getAttributeValue("OrgShortName").value;
  if (!orgCode || !orgShortName) {
    return;
  }
  var idnumber = EdocsApi.getAttributeValue("DocId");
  var methodData = {
    extSysDocId: idnumber.value,
    ExtSysDocVersion: CurrentDocument.version,
    eventType: "CommentAdded",
    comment: caseTaskComment.comment,
    partyCode: orgCode,
    userTitle: CurrentUser.name,
    partyName: orgShortName,
    occuredAt: new Date(),
  };

  caseTaskComment.externalAPIExecutingParams = {
    externalSystemCode: "ESIGN1", // код зовнішньої системи
    externalSystemMethod: "integration/processEvent", // метод зовнішньої системи
    data: methodData, // дані, що очікує зовнішня система для заданого методу
    executeAsync: true, // виконувати завдання асинхронно
  };
}

function ProcessActTask() {
  debugger;
  var stateTask = EdocsApi.getCaseTaskDataByCode("ProcessAct")?.state;

  if ((stateTask == "assigned" || stateTask == "inProgress" || stateTask == "delegated") && !EdocsApi.getAttributeValue("VisaHolders").value) {
    EdocsApi.setControlProperties({ code: "VisaHolders", hidden: false, disabled: false, required: true });

    var StructureDepart = EdocsApi.getAttributeValue("StructureDepart").text;
    if (StructureDepart) {
      var data = EdocsApi.findElementByProperty("id", "1", EdocsApi.getDictionaryData("Commission"))?.code;
      var VisaHolders = getEmployees("VisaHolders", data);
      VisaHolders && EdocsApi.setAttributeValue(VisaHolders);
    }
  } else if (stateTask == "completed") {
    EdocsApi.setControlProperties({ code: "VisaHolders", hidden: false, disabled: true, required: true });
  } else if (stateTask == "rejected") {
    EdocsApi.setControlProperties({ code: "VisaHolders", hidden: false, disabled: true, required: true });
  } else {
  }
}

function onTaskExecuteProcessAct(routeStage) {
  debugger;
  if (routeStage.executionResult == "executed") {
    if (!EdocsApi.getAttributeValue("VisaHolders").value) throw `Внесіть значення в поле «Погоджуючі»`;
  }
}

function onChangeStructureDepart() {
  debugger;
  var StructureDepart = EdocsApi.getAttributeValue("StructureDepart").value;
  if (StructureDepart) {
    var data = EdocsApi.findElementByProperty("id", StructureDepart, EdocsApi.getDictionaryData("Commission"))?.code; //беремо значення із довідника "StructureDepart" та шукаємо значення в довіднику "Commission"
    setVisaHolder(data);
  }
}

function setVisaHolder(data) {
  debugger;
  if (data) {
    var VisaHolder = getEmployees("VisaHolder", data);
    EdocsApi.setAttributeValue(VisaHolder);
  }
}

function getEmployees(codeAttr, data) {
  debugger;
  if (codeAttr && data) {
    var array = data.split(", ");
    var employeeText = null;
    var employee = [];
    for (let index = 0; index < array.length; index++) {
      var employeeById = EdocsApi.getEmployeeDataByEmployeeID(array[index]);
      if (employeeById) {
        employee.push({
          id: 0,
          employeeId: employeeById.employeeId,
          index: index, //потрібно збільшувати на 1
          employeeName: employeeById.shortName,
          positionName: employeeById.positionName,
        });

        employeeText ? (employeeText = employeeText + "\n" + employeeById.positionName + "\t" + employeeById.shortName) : (employeeText = employeeById.positionName + "\t" + employeeById.shortName);
        employeesValue = `[{"id":0,"employeeId":"${employeeById.employeeId}","index":0,"employeeName":"${employeeById.shortName}","positionName":"${employeeById.positionName}"}]`;
      }
    }
    return { code: codeAttr, value: JSON.stringify(employee), text: employeeText };
  }
}

function onChangeHeadCommission() {
  var HeadCommission = EdocsApi.getAttributeValue("HeadCommission").value;
  if (HeadCommission) {
    var employee = EdocsApi.getEmployeeDataByEmployeeID(Number(HeadCommission));
    EdocsApi.setAttributeValue({ code: "Position", value: employee.positionName });
    EdocsApi.setAttributeValue({ code: "TelephoneCus", value: employee.phone });
  } else {
    EdocsApi.setAttributeValue({ code: "Position", value: "" });
    EdocsApi.setAttributeValue({ code: "TelephoneCus", value: "" });
  }
}
