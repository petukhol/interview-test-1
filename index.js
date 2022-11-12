function handleClickWithinSelectComponent() {
  let selectWrapper;
  // logic to decide where we clicked now within the select component
  if (this.event.target.tagName === "DIV") {
    // we found out that we clicked on the select wrapper
    // because this is the only div we have there
    selectWrapper = this.event.target;
  } else {
    // otherwise, it means we click within the dropdown
    const clickedListItem = this.event.target;
    selectWrapper =
      clickedListItem.parentElement.parentElement.parentElement;
    const selectWrapperLabel = selectWrapper.getElementsByTagName(
      "span"
    )[0];
    const clickedListItemText = clickedListItem.textContent;
    selectWrapperLabel.innerHTML = clickedListItemText;
  }

  // close any other select components before opening clicked one
  const currentActive = document.getElementsByClassName("is-active")[0];
  if (currentActive && currentActive != selectWrapper) {
    currentActive.classList.remove("is-active");
  }

  // open or close current clicked on any clicks within the component
  selectWrapper.classList.toggle("is-active");
}

/**
 * Below logic for sessions values save
 */

const CONSTANTS = {
  fieldIdentifier: "field",
  inputFieldType: "input",
  selectFieldType: "select",
  radioFieldType: "radio",
  multiInputFieldType: "multi_input"
}

function helperGetFieldType(fieldId) {
  return fieldId.split("-")[1];
}

function helperGetFieldUniqueId(fieldId) {
  return fieldId.split("-")[2];
}

// on page load: check storage -> populate the values
function populateFieldWithValuesFromStorage() {
  for (const [fieldId, value] of Object.entries(sessionStorage)) {
    if (fieldId.split("-")[0] !== CONSTANTS.fieldIdentifier) {
      // ignore other session properties
      continue;
    }

    // depending on the type, we need to insert the value differently
    const field = document.getElementById(fieldId);
    const fieldType = helperGetFieldType(field.id);
    if (fieldType === CONSTANTS.inputFieldType) {
      field.value = value;
    }

    if (fieldType === CONSTANTS.selectFieldType) {
      const spanContaingValue = field.getElementsByTagName("span")[0];
      spanContaingValue.innerHTML = value;
    }

    if (fieldType === CONSTANTS.radioFieldType && value === "true") {
      field.checked = true;

      const fieldUniqueId = helperGetFieldUniqueId(field.id);
      applyTheme(fieldUniqueId === "dark");
    }

    if (fieldType === CONSTANTS.multiInputFieldType) {
      const multiInputFieldsValues = value.split('-');
      const multiInputFields = field.getElementsByTagName("input");
      for (let i = 0; i < multiInputFields.length; i++) {
        const multiInputField = multiInputFields[i];
        multiInputField.value = multiInputFieldsValues[i];
      }
    }
  };
}

populateFieldWithValuesFromStorage();

// on click save button: save to storage
function submitForm() {
  // find all relevant fields
  const fields = document.querySelectorAll(`[id^="${CONSTANTS.fieldIdentifier}"]`);
  for (let field of fields) {
    // depending on the type, we need to get the value differently
    const fieldType = helperGetFieldType(field.id);

    let value;
    if (fieldType === CONSTANTS.inputFieldType) {
      value = field.value;
    }

    if (fieldType === CONSTANTS.selectFieldType) {
      const spanContaingValue = field.getElementsByTagName("span")[0];
      value = spanContaingValue.textContent;
    }

    if (fieldType === CONSTANTS.radioFieldType) {
      value = field.checked;

      const fieldUniqueId = helperGetFieldUniqueId(field.id);
      if (field.checked && field.checked === true) {
        applyTheme(fieldUniqueId === "dark");
      }
    }

    if (fieldType === CONSTANTS.multiInputFieldType) {
      const multiInputFields = field.getElementsByTagName("input");
      const multiInputFieldsValues = [];
      for (let multiInputField of multiInputFields) {
        multiInputFieldsValues.push(multiInputField.value)
      }
      value = multiInputFieldsValues.join('-');
    }

    sessionStorage.setItem(field.id, value);
  }
}

////////////////////////////////////

function applyTheme(isDark) {
  if (isDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}