var person = null;

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
    toggleVisibility("add-container");
}

function load_people() {
    const person_list = document.getElementById("person-list");
    person_list.innerHTML = ""; // clear existing list
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // log all the gathered information
        const person = JSON.parse(localStorage.getItem(key));
        //console.log(`ID: ${key}, Name: ${person.name}, Job: ${person.job}, Profession: ${person.profession}, Information: ${person.information}`);
        // create a div for each person
        if (key !== "id_counter") {
            id = key;
            const person_div = document.createElement("div");
            person_div.className = "person-entry";
            person_div.innerHTML = `<h3>${person.name}</h3>
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

            const edit_btn = document.createElement("button");
            edit_btn.className = "edit-btn";
            edit_btn.innerText = "Bearbeiten";

            person_div.appendChild(settings_btn);
            person_div.appendChild(edit_btn);
        }
    }   
    //console.log("---- End of List ----------------------------");
}

function update_person(id, name, job, profession, information) {
    console.log(`Updating person with ID ${id}`);
    console.log(`New data - Name: ${name}, Job: ${job}, Profession: ${profession}, Information: ${information}`);
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
    console.log(`Person with ID ${id} deleted.`);
    load_people();
}

// frontend functions

function createID() {
    return localStorage.getItem("id_counter") ? parseInt(localStorage.getItem("id_counter")) + 1 : 0;
}

// toggle visibility of add person form
document.getElementById("add-person-btn").addEventListener("click", function() {
    toggleVisibility("add-container");
})

document.getElementById("submit-btn").addEventListener("click", function() {
    const name = document.getElementById("name-input").value;
    const job = document.getElementById("job-input").value;
    const profession = document.getElementById("profession-input").value;
    const information = document.getElementById("info-input").value;
    create_person(name, job, profession, information);
});

document.getElementById("edit-btn").addEventListener("click", function() {

    console.log(person);
    console.log(`Editing person with ID: ${person.id}`);

    // use user new input to update person or use existing data if input is empty
    const name = document.getElementById("edit-name-input").value || person.name;
    const job = document.getElementById("edit-job-input").value || person.job;
    const profession = document.getElementById("edit-profession-input").value || person.profession;
    const information = document.getElementById("edit-info-input").value || person.information;

    update_person(person.id, name, job, profession, information);
    toggleVisibility("edit-container");
});

document.getElementById("person-list").addEventListener("click", function(event) {
    if (event.target.classList.contains("settings-btn")) {
        const id = event.target.parentElement.getAttribute("data-id");
        delete_person(id);
    }
})

document.getElementById("person-list").addEventListener("click", function(event) {
    if (event.target.classList.contains("edit-btn")) {
        toggleVisibility("edit-container");
        id = event.target.parentElement.getAttribute("data-id");
        person = JSON.parse(localStorage.getItem(id));
    }
});

// function to toggle visibility of a form

function toggleVisibility(id) {
    const form = document.getElementById(id);
    visible = form.style.display === "block";
    if (visible) {
        form.style.display = "none";
    } else {
        form.style.display = "block";
    }
}

// initial load

load_people();