var person = null;
var last = null;

// main backend functions

function create_person(name, job, profession, information) {
    name = name || "Unbekannt";
    job = job || "Unbekannt";
    profession = profession || "Unbekannt";
    information = information || "Keine Informationen vorhanden.";
    id = createID();

    localStorage.setItem(id, JSON.stringify({
        id: id,
        name: name,
        job: job,
        profession: profession,
        information: information
    }));
    localStorage.setItem("id_counter", id);
    clearForm();
    load_people();
    setVisibility("add-container", false);
}

function load_people() {
    const person_list = document.getElementById("person-list");
    person_list.innerHTML = ""; // clear existing list
    // create a div for each person
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const person = JSON.parse(localStorage.getItem(key));
        //console.log(`ID: ${key}, Name: ${person.name}, Job: ${person.job}, Profession: ${person.profession}, Information: ${person.information}`);
        if (key !== "id_counter") {
            id = key;
            const person_div = document.createElement("div");
            person_div.className = "person-entry";
            person_div.id = `person`;
            person_div.innerHTML = `<div class="edit-btn"></div>
                                    <h3>${person.name}</h3>
                                    <p><strong>Job:</strong> ${person.job}</p>
                                    <p><strong>Stellenbezeichnung:</strong> ${person.profession}</p>
                                    <p><strong>Informationen:</strong> ${person.information}</p>
                                    
                                    `;
            person_div.setAttribute("data-id", id);
            person_list.appendChild(person_div);

            // add settings button for deleting and editing
            const settings_btn = document.createElement("button");
            settings_btn.className = "settings-btn";
            settings_btn.innerText = "Löschen";
            person_div.appendChild(settings_btn);

        }
    }   
}

function update_person(id, name, job, profession, information) {
    // console.log("New values - Name:", name, "Job:", job, "Profession:", profession, "Information:", information);
    const person = {
        id: id,
        name: name,
        job: job,
        profession: profession,
        information: information
    };
    localStorage.setItem(id, JSON.stringify(person));

    clearEditForm();
    load_people();
}

function setInformation() {
    const fields = {
        "edit-name-input": { value: person.name, default: "Unbekannt" },
        "edit-job-input": { value: person.job, default: "Unbekannt" },
        "edit-profession-input": { value: person.profession, default: "Unbekannt" },
        "edit-info-input": { value: person.information, default: "Keine Informationen vorhanden." }
    };

    for (const [id, { value, default: defaultValue }] of Object.entries(fields)) {
        document.getElementById(id).value = value !== defaultValue ? value : "";
    }

    last = person.id;
}

function clearForm() {
    document.getElementById("name-input").value = "";
    document.getElementById("job-input").value = "";
    document.getElementById("profession-input").value = "";
    document.getElementById("info-input").value = "";
}

function clearEditForm() {
    document.getElementById("edit-name-input").value = "";
    document.getElementById("edit-job-input").value = "";
    document.getElementById("edit-profession-input").value = "";
    document.getElementById("edit-info-input").value = "";
}

function delete_person(id) {
    localStorage.removeItem(id);
    load_people();
}

function createID() {
    return localStorage.getItem("id_counter") ? parseInt(localStorage.getItem("id_counter")) + 1 : 0;
}

// frontend functions

// toggle visibility of add person form
document.getElementById("add-person-btn").addEventListener("click", function() {
    setVisibility("add-container");
})

document.getElementById("submit-btn").addEventListener("click", function() {
    const name = document.getElementById("name-input").value;
    const job = document.getElementById("job-input").value;
    const profession = document.getElementById("profession-input").value;
    const information = document.getElementById("info-input").value;
    create_person(name, job, profession, information);
});

document.getElementById("edit-btn").addEventListener("click", function() {

    //clearEditForm();

    // use user new input to update person or use existing data if input is empty
    const name = document.getElementById("edit-name-input").value || person.name;
    const job = document.getElementById("edit-job-input").value || person.job;
    const profession = document.getElementById("edit-profession-input").value || person.profession;
    const information = document.getElementById("edit-info-input").value || person.information;

    update_person(person.id, name, job, profession, information);
    setVisibility("edit-container");
});

document.getElementById("person-list").addEventListener("click", function(event) {
    if (event.target.classList.contains("settings-btn")) {
        const id = event.target.parentElement.getAttribute("data-id");
        delete_person(id);
    }
})

document.getElementById("person-list").addEventListener("click", function(event) {
    if (event.target.classList.contains("edit-btn")) {
        current = event.target.parentElement.getAttribute("data-id");
        // if the edit is clicked but form is closed, open it
        if (document.getElementById("edit-container").style.display == "none") {
            setVisibility("edit-container", true);
        } else if (last == current) {
            setVisibility("edit-container", false);
            return;
        }
        // console.log(last, current);
        id = event.target.parentElement.getAttribute("data-id");
        person = JSON.parse(localStorage.getItem(id));
        // console.log("Editing person:", person.name);
        setInformation();
    }
});

// function to toggle visibility of a form

function setVisibility(id, value) {
    // check if either container or edit-container is visible, if one of them gets visible close the other one
    if (id == "add-container") {
        document.getElementById("edit-container").style.display = "none";
    } else if (id == "edit-container") {
        document.getElementById("add-container").style.display = "none";
    }
        if (value === undefined) {
            current = document.getElementById(id).style.display
            if (current == "block") {
                value = false;
            } else {1
                value = true;
            }
        }
        //console.log("Setting visibility of", id, "to", value);
        const form = document.getElementById(id);
        if (value == true) {
            form.style.display = "block";
        } else {
            form.style.display = "none";
        }
}

// initial load

load_people();