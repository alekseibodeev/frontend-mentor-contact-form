const errorMessages = {
  required: "This field is required",
  email: "Please enter a valid email address",
  consent: "To submit this form, please consent to being contacted",
  "query-type": "Please select a query type",
};

const query = (selector) => {
  const data = {};
  document.querySelectorAll(selector).forEach((element) => {
    const name =
      element.getAttribute("name") || element.getAttribute("data-name");

    if (!name) throw new Error("Missing name attribute");

    data[name] = element;
  });

  return data;
};

const inputs = query(".form-field__input");
const errors = query(".form-field__error");
const form = document.getElementById("contact-form");
const submit = document.getElementById("submit");
const toast = document.getElementById("success");

const validateInput = (name) => {
  const input = inputs[name];
  const error = errors[name];
  if (input.validity.valueMissing) {
    input.classList.add("input_invalid");
    error.textContent = errorMessages.required;
  } else {
    input.classList.remove("input_invalid");
    error.textContent = "";
  }
};

const validateEmail = () => {
  const input = inputs.email;
  const error = errors.email;
  if (input.checkValidity()) {
    input.classList.remove("input_invalid");
  } else {
    input.classList.add("input_invalid");
  }

  if (input.validity.typeMismatch) {
    error.textContent = errorMessages.email;
  } else if (input.validity.valueMissing) {
    error.textContent = errorMessages.required;
  } else {
    error.textContent = "";
  }
};

const validateQueryType = () => {
  const input = inputs["query-type"];
  const error = errors["query-type"];
  const radios = Array.from(input.querySelectorAll("input"));
  if (radios.every((radio) => radio.checked === false)) {
    error.textContent = errorMessages["query-type"];
  } else {
    error.textContent = "";
  }
};

const validateConsent = () => {
  const input = inputs.consent;
  const error = errors.consent;
  if (input.validity.valueMissing) {
    input.classList.add("input_invalid");
    error.textContent = errorMessages.consent;
  } else {
    input.classList.remove("input_invalid");
    error.textContent = "";
  }
};

const validate = (name) => {
  switch (name) {
    case "email":
      validateEmail();
      break;
    case "query-type":
      validateQueryType();
      break;
    case "consent":
      validateConsent();
      break;
    default:
      validateInput(name);
  }
};

const handleInputChange = (event) => {
  const target = event.target;
  const name = target.getAttribute("name") || target.getAttribute("data-name");
  validate(name);
};

const createOpenToast = () => {
  const TOAST_DURATION = 2500;
  let timeoutId;
  return () => {
    if (timeoutId) clearTimeout(timeoutId);
    toast.show();
    timeoutId = setTimeout(() => {
      toast.close();
    }, TOAST_DURATION);
  };
};

const openToast = createOpenToast();

const clearForm = () => {
  Object.entries(inputs).forEach(([name, input]) => {
    if (name === "query-type") {
      input.querySelectorAll("input").forEach((radio) => {
        radio.checked = false;
      });
    } else if (name === "consent") {
      input.checked = false;
    } else {
      input.value = "";
    }
  });
};

Object.values(inputs).forEach((input) =>
  input.addEventListener("change", handleInputChange)
);

submit.addEventListener("click", (event) => {
  event.preventDefault();
  if (form.checkValidity()) {
    openToast();
    clearForm();
  } else {
    Object.keys(inputs).forEach((name) => validate(name));
  }
});
