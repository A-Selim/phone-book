let sampleContacts = [
    { name: "Karl", phone: "0100001" },
    { name: "Per", phone: "0100002" },
    { name: "Katie", phone: "0100003" },
    { name: "Lupe", phone: "0100004" },
    { name: "Katherine", phone: "0100005" },
];

let contacts = [];
let contactsFromLocalStorage = JSON.parse(localStorage.getItem("contacts"));

const searchInput = document.querySelector("#search-input");
const results = document.querySelector(".results");
const names = document.getElementsByClassName("name");
const overlay = document.querySelector(".overlay");
const detail = document.querySelector(".detail");
const backBtn = document.querySelector("#back-btn");
const addNameInput = document.querySelector("#add-name");
const addPhoneInput = document.querySelector("#add-phone");
const saveBtn = document.querySelector("#save-btn");
const accentText = document.querySelector(".accent-text");
const deleteAllBtn = document.querySelector("#delete-all-btn");
const deleteBtns = document.getElementsByClassName("delete-btn");
const warningText = document.querySelector(".warning-text");

// Render contacts from localstorage if it has contacts stored
if (contactsFromLocalStorage) {
    renderNamesList(contactsFromLocalStorage);
    accentText.textContent = "";
} else {
    renderNamesList(sampleContacts);
}

// Render contacts' array in HTML
function renderNamesList(array) {
    let namesList = "";
    for (const contact of array) {
        namesList += `<li class="name">${contact.name}<span class="delete-btn">&#10005;<span></li>`;
    }
    results.innerHTML = namesList;
}

// Search action
searchInput.addEventListener("keyup", function () {
    const input = searchInput.value.toLowerCase();

    for (const name of names) {
        const nameLowerCase = name.textContent.toLowerCase();

        if (nameLowerCase.includes(input)) {
            name.style.display = "block";
        } else {
            name.style.display = "none";
        }
    }
});

// Make every list item act as a button & show detail overlay
results.addEventListener("click", function (event) {
    // To prevent the click between elements
    if (event.target.className !== "name") {
        return;
    }
    overlay.style.display = "block";
    // Store the name clicked after remove the last character x (which is delete button)
    const elName = event.target.textContent.slice(0, -1);
    if (contacts.length >= 1) {
        const elPhone = contacts.find((e) => e.name === `${elName}`).phone;
        detail.innerHTML = `<h2>Name : ${elName}</h2>
                            <h2>Phone: ${elPhone}</h2>`;
    } // if user refresh page after save (contacts = []), search name in contactsFromLocalStorage array
    else if (contactsFromLocalStorage) {
        const elPhone = contactsFromLocalStorage.find((e) => e.name === `${elName}`).phone;
        detail.innerHTML = `<h2>Name : ${elName}</h2>
                            <h2>Phone: ${elPhone}</h2>`;
    } else {
        const elPhone = sampleContacts.find((e) => e.name === `${elName}`).phone;
        detail.innerHTML = `<h2>Name : ${elName}</h2>
                            <h2>Phone: ${elPhone}</h2>`;
    }
});

// Make overlay disappear by click back btn
backBtn.addEventListener("click", function () {
    overlay.style.display = "none";
});

// When save btn clicked
saveBtn.addEventListener("click", function () {
    if (addNameInput.value === "") {
        warningText.textContent = "Please enter a name";
    } else if (addPhoneInput.value === "" || isNaN(addPhoneInput.value)) {
        addPhoneInput.value = "";
        addPhoneInput.placeholder = "Please enter a valid phone number";
    } else {
        contacts.push({ name: addNameInput.value, phone: addPhoneInput.value });
        updateLocalStorage();
        renderNamesList(contactsFromLocalStorage);
        addNameInput.value = "";
        addPhoneInput.value = "";
        addPhoneInput.placeholder = "";
        accentText.textContent = "";
    }
});

// Make warning text disappear when start to write at name field
addNameInput.addEventListener("keyup", function () {
    warningText.textContent = "";
});

// When delete all btn clicked
deleteAllBtn.addEventListener("click", function () {
    if (contacts.length >= 1) {
        contacts = [];
        renderNamesList(contacts);
    } else {
        sampleContacts = [];
        renderNamesList(sampleContacts);
    }
    localStorage.clear();
    accentText.textContent = "";
});

// When individual delete btn clicked
results.addEventListener("click", function (event) {
    // To be sure the click is on delete btn not class="name"
    if (event.target.className !== "delete-btn") {
        return;
    }
    // Get the index of the clicked delete btn
    let index = Array.from(deleteBtns).indexOf(event.target);
    if (contacts.length >= 1) {
        contacts.splice(index, 1);
        updateLocalStorage();
        renderNamesList(contactsFromLocalStorage);
    }// if user refresh page (contacts = []), delete contact from contactsFromLocalStorage array
    else if (contactsFromLocalStorage) {
        contactsFromLocalStorage.splice(index, 1);
        updateLocalStorage();
        renderNamesList(contactsFromLocalStorage);
    } else {
        sampleContacts.splice(index, 1);
        renderNamesList(sampleContacts);
    }
    if (contacts.length === 0 || sampleContacts.length === 0) {
        accentText.textContent = "";
    }
});

// Function to save to localStorage & update contactsFromLocalStorage
function updateLocalStorage() {
    // Save contacts array in localStorage
    localStorage.setItem("contacts", JSON.stringify(contacts));
    // Update variable contactsFromLocalStorage
    contactsFromLocalStorage = JSON.parse(localStorage.getItem("contacts"));
}
