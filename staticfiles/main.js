console.log("hello world")
const uploadForm = document.getElementById("myform")
const input = document.getElementById("id_doc_file")
console.log(uploadForm)

const alertBox = document.getElementById("alert-box")
const progressBox = document.getElementById("progress-box")
const imageBox = document.getElementById("image-box")
const cancelBox = document.getElementById("cancel-box")
const cancelButton = document.getElementById("cancel")

const csrf = document.getElementsByName('csrfmiddlewaretoken')

input.addEventListener('change', () => {
    progressBox.classList.remove('not-visible')
    cancelBox.classList.remove('not-visible')
    imageBox.classList.remove('not-visible')

    const input_data = input.files[0]
    console.log(input_data)
    const url = URL.createObjectURL(input_data)
    const fd = new FormData()
    fd.append('csrfmiddlewaretoken', csrf[0].value)
    fd.append('doc_file', input_data)

    $.ajax({
        type: 'POST',
        url: uploadForm.action,
        enctype: 'multipart/form-data',
        data: fd,
        beforeSend: function () {
            console.log("before")
            alertBox.innerHTML = ""
        },
        xhr: function () {
            const xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener('progress', e => {
                //console.log(e)
                if (e.lengthComputable) {
                    const percent = e.loaded / e.total * 100
                    console.log(percent)
                    progressBox.innerHTML = `<div class="progress">
                                                <div class="progress-bar" role="progressbar" style="width: ${percent}%" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>${percent.toFixed(1)}%`

                }
                if (input_data['type'].includes('image')) {
                    imageBox.innerHTML = `<img src="${url}" alt="${input_data['name']}" width="500" height="600">`

                }


            })
            cancelButton.addEventListener('click', () => {
                xhr.abort()
                setTimeout(() => {
                    progressBox.innerHTML = ""
                    cancelBox.classList.add('not-visible')
                    imageBox.classList.add('not-visible')
                    uploadForm.reset()

                })

            })
            return xhr

        },
        success: function (response) {
            console.log(response)
            alertBox.innerHTML = `<div class="alert alert-success" role="alert">
            file successfully uploaded!
          </div>`
            cancelBox.classList.remove('not-visible')

        },
        error: function (error) {
            alertBox.innerHTML = `<div class="alert alert-danger" role="alert">
            Oops..Somethin went wrong!
          </div>`

        },
        cache: false,
        contentType: false,
        processData: false,



    })
})

