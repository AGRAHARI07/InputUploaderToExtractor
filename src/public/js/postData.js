let prevExtColumnIds = [`column-name-_url-prev`, `column-1-prev`, `column-2-prev`];
let nextExtColIds = [`column-name-_url-next`, `column-1-next`, `column-2-next`];
let extractorId = document.getElementById(`extractor-id`);
let needDeDup = document.querySelector('#need-to-deDup');
let tagToAppend = document.querySelector('#column-tag');


async function postUrlsToExtractor() {
    const res = await fetch(`http://localhost:3000/api/postDataToExtractor`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
            extractorId: extractorId.value,
            columnValues: getInputValues(),
            deDup: needDeDup.checked,
            tag: tagToAppend.value
        })
    })
    console.log(res);
    return res;
}

function getInputValues() {
    let values = [];
    for (elm = 0; elm < nextExtColIds.length; elm++) {
        let oldValue = document.getElementById(prevExtColumnIds[elm]).value;
        let newValue = document.getElementById(nextExtColIds[elm]).value;
        if (oldValue && newValue) {
            values.push({
                old: oldValue,
                new: newValue
            })
        }
    }

    console.log(values);
    return values;
}

// asking server to post the read data to extractor
let postButtonTag = document.getElementById(`post-data-to-extractor`);
postButtonTag.addEventListener('click', async function() {
    let isInputValid = validateInputParams();
    if (isInputValid) {
        showSpinner()
        let response = await postUrlsToExtractor()
        console.log(response);
        hideSpinner()
        changeClassAndDisable(response);
    }
})

function changeClassAndDisable(response) {
    if (response.status === 200) {
        postButtonTag.classList.replace(`btn-primary`, 'btn-success')
        postButtonTag.disabled = true;
        alert('Uploaded urls successfully');

        [...prevExtColumnIds, ...nextExtColIds].forEach(element => {
            document.getElementById(element).value = "";
        });

        extractorId.value = "";
    } else {
        alert('Something went wrong, try once clicking post data to extractor button');
    }
}

function validateInputParams() {
    function getInputValidated() {
        let extractorIdValue = extractorId.value;
        if (extractorIdValue && extractorIdValue.length === 36 && extractorIdValue.match(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/)[0]) {
            if (document.getElementById("column-name-_url-prev").value) {
                return getValidatedOptionalParam()
            } else {
                alert('Please enter _url mapping parameter value');
                return false
            }
        } else {
            alert('Please enter correct extractor ID');
            return false
        }
    }

    function getValidatedOptionalParam() {
        // col-1
        let flag = checkTwoValues(`column-1-prev`, 'column-1-next');
        if (flag) {
            flag = checkTwoValues(`column-2-prev`, 'column-2-next')
        }

        return flag;
    }

    function checkTwoValues(id1, id2) {
        let boolean;
        let v1 = document.getElementById(id1).value;
        let v2 = document.getElementById(id2).value;
        if (v1 == "" && v2 == "") {
            boolean = true;
        } else {
            boolean = !!v1 && !!v2;
        }

        boolean ? "" : alert('Please fill other column');
        return boolean;
    }

    return getInputValidated()
}


// adding the first row i.e header of the uploaded file
document.addEventListener("DOMContentLoaded", async function() {
    let data = await fetch(`http://localhost:3000/first-line`);
    let jsonData = await data.json();
    console.log(jsonData)
    let firstLine = JSON.parse(jsonData.file_headers);
    appendHeaders(firstLine);
});

function appendHeaders(firstLine) {
    let count = firstLine.length;
    let btnClasses = ['badge-warning', 'badge-dark', 'badge-success'];
    let i = 0;
    let divWidth = 12 / count;
    let classes = [`col-md-${divWidth-1}`, `ml-5`, 'p-2', 'badge'];

    firstLine.forEach(header => {

        let span = document.createElement("span");
        let allClasses = [...classes, btnClasses[i++]];
        span.classList.add(...allClasses);
        span.innerText = header;
        document.getElementById('fileHeaders').insertAdjacentElement('beforeend', span);
    });
}



// spinner
const spinner = document.getElementById("spinner");

function showSpinner() {
    spinner.hidden = false;
}

function hideSpinner() {
    spinner.hidden = true;
}