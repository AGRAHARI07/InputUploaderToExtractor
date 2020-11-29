document.querySelector("#uploadForm").addEventListener("submit", function(e) {
    let fileInputTag = document.querySelector(`#uploadForm input[type="file"]`);
    let files = fileInputTag && fileInputTag.files;

    let isFileSelected = files.length !== 0 ? true : false;
    if (isFileSelected) {
        let fileName = files[0] && files[0].name;
        let matches = ["csv", "xls", "xlsx"];
        let isFileValid = matches.some(el => fileName.includes(el));
        if (!isFileValid) {
            e.preventDefault(); //stop form from submitting
            alert(`Please select valid file`);
        }
    } else {
        e.preventDefault(); //stop form from submitting
        alert(`Please select the file`);
    }
});

$('.custom-file-input').on('change', function() {
    let fileName = $(this).val().split('\\').pop();
    $(this).next('.custom-file-label').addClass("selected").html(fileName);
});

async function postExtractorId() {
    let extractorId = document.querySelector('#extractorId');

    const res = await fetch(`http://localhost:3000/postlatestcrawlrun`, {
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
        })
    })
    console.log(res);
    return res;
}