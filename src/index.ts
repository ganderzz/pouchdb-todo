import PouchDB from "pouchdb";

const db = new PouchDB("todos");

function generateUniqueId() {
    return new Date().toJSON();
}

function updateList() {
    db.allDocs<{ text: string }>({include_docs: true}).then(values => {
        $("#todo-list").innerHTML = "";

        values.rows.forEach((p) => {
            const li = document.createElement("li");
            li.innerHTML = p.doc.text;
            li.id = p.doc._id;
            li.className = "list-group-item list-group-item-action";
            li.style.cursor = "pointer";

            $("#todo-list").appendChild(li);
        });
    })
}

function $(selector) {
    return document.querySelector(selector);
}

function removeNode(elem: Element) {
    if (!elem) {
        return;
    }

    elem.parentNode.removeChild(elem);
}

$("#todo-text").addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Enter") {
        $("#todo-add").click();
    }
})

$("#todo-list").addEventListener("click", (event) => {
    if (event.target.tagName === "LI") {
        const elem = event.target;

        db.get(elem.id).then(doc => {
            db.remove(doc);
            removeNode(elem);
        })
    }
});

$("#todo-add").addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();

    const value = $("#todo-text").value;

    if (value.length <= 0) {
        return;
    }

    db.put({
        "_id": `${generateUniqueId()}`,
        "text": value
    }).then(() => {
        const input = $("#todo-text");
        input.value = "";
        input.focus();

        updateList();
    })
});

window.onload = () => {
    updateList();
}
