console.log("hello world")
const uploadForm = document.getElementById("myform")
const input = document.getElementById("id_doc_file")
const input2 = document.getElementById("id_doc_size")
const input3 = document.getElementById("id_doc_type")
input2.classList.add('not-visible')
input3.classList.add('not-visible')
console.log(uploadForm)
const alertBox = document.getElementById("alert-box")
const progressBox = document.getElementById("progress-box")
const imageBox = document.getElementById("image-box")
const cancelBox = document.getElementById("cancel-box")
const cancelButton = document.getElementById("cancel")
const dropzone = document.getElementById('dropzone');
const csrf = document.getElementsByName('csrfmiddlewaretoken')



dropzone.ondrop = function (e) {
    //input.files = e.dataTransfer.files
    e.preventDefault();
    this.className = 'dropzone';
    //x = e.dataTransfer.files
    //console.log(x)
    const input_data = e.dataTransfer.files
    imageBox.innerHTML = ""
    for (let index = 0; index < input_data.length; index++) {
        upload(input_data[index])
    }

};

dropzone.ondragover = function () {
    this.className = 'dropzone dragover';
    return false;
};

dropzone.ondragleave = function () {
    this.className = 'dropzone';

    return false;
};



input.addEventListener('change', () => {
    const input_data = input.files
    imageBox.innerHTML = ""
    for (let index = 0; index < input_data.length; index++) {
        upload(input_data[index])
    }
})

function preview(input_data) {
    type = input_data['type']
    if (type.includes('image')) {
        const url = URL.createObjectURL(input_data)
        var image = document.createElement("img");
        image.setAttribute("src", `${url}`)
        image.setAttribute("width", "100");
        image.setAttribute("height", "100");
        image.setAttribute("alt", `"${input_data['name']}"`);
        imageBox.appendChild(image);
        //imageBox.innerHTML.append(`<img src="${url}" alt="${input_data['name']}" width="200" height="200">`)
    } else {
        var icon = document.createElement("i");
        icon.setAttribute("style", "font-size: 4rem;")

        if (type.includes('pdf')) {
            icon.setAttribute("class", "far fa-file-pdf")
            imageBox.appendChild(icon)
        } else if (type.includes('zip') || type.includes('compressed')) {
            icon.setAttribute("class", "far fa-file-archive")
            imageBox.appendChild(icon)
        } else if (type.includes('video')) {
            const url = URL.createObjectURL(input_data)
            var video = document.createElement("video");
            video.src = url
            video.width = 100
            video.height = 100
            video.autoplay = true
            video.muted = true
            video.loop = true
            imageBox.appendChild(video)
        } else {
            icon.setAttribute("class", "far fa-file")
            imageBox.appendChild(icon)
        }

    }
}

function upload(file) {
    progressBox.classList.remove('not-visible')
    cancelBox.classList.remove('not-visible')
    imageBox.classList.remove('not-visible')

    const input_data = file
    console.log(input_data)
    //const url = URL.createObjectURL(input_data)
    const fd = new FormData()
    fd.append('csrfmiddlewaretoken', csrf[0].value)
    fd.append('doc_file', input_data)
    fd.append('doc_size', input_data['size'])
    fd.append('doc_type', input_data['type'])

    $.ajax({
        type: 'POST',
        url: uploadForm.action,
        enctype: 'multipart/form-data',
        data: fd,
        beforeSend: function () {
            console.log("before")
            alertBox.innerHTML = ""
            preview(input_data)
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
            })
            cancelButton.addEventListener('click', () => {
                xhr.abort()
                setTimeout(() => {
                    progressBox.innerHTML = ""
                    alertBox.innerHTML = ""
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
}
