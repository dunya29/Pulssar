// formReset
function formReset(form, errorClean = false) {
    if (form.querySelectorAll(".form-group").length > 0) {
        form.querySelectorAll(".form-group").forEach(item => item.classList.remove("error"))
    }
    if (form.querySelectorAll("[data-error]").length > 0 && errorClean) {
        form.querySelectorAll("[data-error]").forEach(item => item.textContent = '')
    }
    form.querySelectorAll("input").forEach(inp => {
        if (!["hidden", "checkbox", "radio"].includes(inp.type)) {
            inp.value = ""
        }
        if (["checkbox", "radio"].includes(inp.type) && !inp.classList.contains("required")) {
            inp.checked = false
        }
    })
    if (form.querySelector("textarea")) {
        form.querySelector("textarea").value = ""
    }
    if (form.querySelector(".file-form__items")) {
        form.querySelector(".file-form__items").innerHTML = ""
    }
}
//tabswitch
function tabSwitch(nav, block) {
    nav.forEach(item => {
        item.addEventListener("click", () => {
            nav.forEach(el => {
                el.classList.remove("active")
                el.setAttribute("aria-selected", false)
            })
            item.classList.add("active")
            item.setAttribute("aria-selected", true)
            block.forEach(el => {
                if (el.dataset.block === item.dataset.tab) {
                    if (!el.classList.contains("active")) {
                        el.classList.add("active")
                        el.style.opacity = "0"
                        setTimeout(() => {
                            el.style.opacity = "1"
                            const disabledForm = el.closest(".disabled-form")
                            if (disabledForm) {
                                toggleSubmitBtn(disabledForm)
                            }
                        }, 0);
                    }
                } else {
                    el.classList.remove("active")
                    formReset(el)
                }
            })
        })
    });
}
//switch active tab/block
const switchBlock = document.querySelectorAll(".switch-block")
if (switchBlock) {
    switchBlock.forEach(item => {
        tabSwitch(item.querySelectorAll("[data-tab]"), item.querySelectorAll("[data-block]"))
    })
}
// phone validation
function isPhone(value) {
    return value.match(/^\+7 \d{3} \d{3}-\d{2}-\d{2}$/) ? true : false
}
// email validation
function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,8}$/.test(value);
}
function isInputValid(inp) {
    if (inp.type === 'checkbox' || inp.type === 'radio') {
        return inp.checked;
    }
    if (!inp.value) return false;
    if (inp.type === 'email') {
        return isEmail(inp.value);
    }
    if (inp.type === 'tel') {
        return inp.inputmask?.isComplete();
    }
    return true;
}
// input add error
function formAddError(inp) {
    inp.closest('.form-group')?.classList.add('error');
}
// input remove error
function formRemoveError(inp) {
    inp.closest('.form-group')?.classList.remove('error');
}
function getRequiredInputs(form) {
    return Array.from(
        form.querySelectorAll('input[required]')
    ).filter(input => {
        const block = input.closest('[data-block]');
        return !block || block.classList.contains('active');
    });
}
//enable/disable submit btn
function toggleSubmitBtn(form) {
    if (!form.classList.contains("cart-form")) {
        const requiredInputs = getRequiredInputs(form)
        const submitBtn = form.querySelector('button[type=submit]');
        if (requiredInputs.length && submitBtn) {
            let hasInvalid = [...requiredInputs].some(inp => !isInputValid(inp));
            submitBtn.disabled = hasInvalid;
            submitBtn.style.opacity = hasInvalid ? 0.5 : 1;
            submitBtn.style.pointerEvents = hasInvalid ? 'none' : 'auto';
        }
    }
}
const disabledForm = document.querySelectorAll(".disabled-form")
if (disabledForm.length) {
    disabledForm.forEach(form => {
        //mask input
        const inpTel = form.querySelectorAll('input[type=tel]')
        if (inpTel) {
            inpTel.forEach(item => {
                Inputmask(
                    {
                        mask: "+7 999 999-99-99",
                        oncomplete: function () {
                            formRemoveError(item)
                            toggleSubmitBtn(form)
                        },
                    }
                ).mask(item);
            })
        }
        const requiredInputs = form.querySelectorAll("input[required]")
        if (requiredInputs.length > 0) {
            let timeOut
            toggleSubmitBtn(form)
            requiredInputs.forEach(inp => {
                if (['checkbox', 'radio'].includes(inp.type)) {
                    inp.addEventListener("change", () => {
                        formRemoveError(inp)
                        toggleSubmitBtn(form)
                    })
                } else if (inp.type !== 'tel') {
                    inp.addEventListener("input", () => {
                        if (isInputValid(inp)) {
                            formRemoveError(inp)
                        }
                        clearTimeout(timeOut)
                        timeOut = setTimeout(() => {
                            toggleSubmitBtn(form)
                        }, 300);
                    })
                }
            })
            //validation
            form.addEventListener('submit', e => {
                e.preventDefault();
                let errors = 0;
                const inpRequired = getRequiredInputs(form)
                if (inpRequired.length) {
                    inpRequired.forEach(inp => {
                        if (!isInputValid(inp)) {
                            errors++;
                            formAddError(inp);
                        }
                    });
                }
                if (errors === 0) {
                    //form.submit();
                    sendOrder();
                } else {
                    let firstErrorEl = form.querySelector('.form-group.error')
                    smoothScrollTo(firstErrorEl)
                }
            });
        }
    })
}
const mainModal = document.querySelectorAll(".main-modal")
function checkIOS() {
    let platform = navigator.platform;
    let userAgent = navigator.userAgent;
    return (
        // iPhone, iPod, iPad
        /(iPhone|iPod|iPad)/i.test(platform) ||
        // iPad на iOS 13+
        (platform === 'MacIntel' && navigator.maxTouchPoints > 1 && !window.MSStream) ||
        // User agent проверка
        (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)
    );
}
let isIOS = checkIOS()
//enable scroll
function enableScroll() {
    if (!document.querySelector(".main-modal.open")) {
        if (document.querySelectorAll(".fixed-block")) {
            document.querySelectorAll(".fixed-block").forEach(block => block.style.paddingRight = '0px')
        }
        document.body.style.paddingRight = '0px'
        document.body.classList.remove("no-scroll")

        // для IOS
        if (isIOS) {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            let scrollY = document.body.dataset.scrollY;
            window.scrollTo(0, parseInt(scrollY || '0'));
        }
    }
}
//disable scroll
function disableScroll() {
    if (!document.querySelector(".main-modal.open")) {
        let paddingValue = window.innerWidth > 350 ? window.innerWidth - document.documentElement.clientWidth + 'px' : 0
        if (document.querySelector(".fixed-block")) {
            document.querySelectorAll(".fixed-block").forEach(block => block.style.paddingRight = paddingValue)
        }
        document.body.style.paddingRight = paddingValue
        document.body.classList.add("no-scroll");
        // для IOS
        if (isIOS) {
            let scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.top = `-${scrollY}px`;
            document.body.dataset.scrollY = scrollY;
        }
    }
}
//open modal
function openModal(modal) {
    if (closePopup) {
        closePopup()
    }
    let activeModal = document.querySelector(".main-modal.open")
    disableScroll()
    if (activeModal) {
        activeModal.classList.remove("open")
    }
    modal.classList.add("open")
}
//close modal
function closeModal(modal) {
    if (modal.querySelector("video")) {
        modal.querySelectorAll("video").forEach(item => item.pause())
    }
    modal.classList.remove("open")
    setTimeout(() => {
        enableScroll()
    }, animSpd);
}
// modal click outside
if (mainModal) {
    mainModal.forEach((mod) => {
        mod.addEventListener("click", (e) => {
            if (!mod.querySelector(".main-modal__content").contains(e.target)) {
                closeModal(mod);
            }
        });
        mod.querySelectorAll(".main-modal-close").forEach(btn => {
            btn.addEventListener("click", () => {
                closeModal(mod)
            })
        })
    });
}
// modal button on click
function modalShowBtns() {
    const modOpenBtn = document.querySelectorAll(".mod-open-btn")
    if (modOpenBtn.length) {
        modOpenBtn.forEach(btn => {
            btn.addEventListener("click", e => {
                e.preventDefault()
                let href = btn.getAttribute("data-modal")
                openModal(document.getElementById(href))
            })
        })
    }
}
modalShowBtns()
// modal close button on click
function modalUnshowBtns() {
    const modCloseBtn = document.querySelectorAll(".mod-close-btn")
    if (modCloseBtn.length) {
        modCloseBtn.forEach(btn => {
            btn.addEventListener("click", e => {
                e.preventDefault()
                let href = btn.getAttribute("data-modal")
                closeModal(document.getElementById(href))
            })
        })
    }
}
modalUnshowBtns()
//file-form
let allFileTypes = [
    { "extension": ".png", "mimeType": "image/png" },
    { "extension": [".jpg", ".jpeg"], "mimeType": "image/jpeg" },
    { "extension": ".gif", "mimeType": "image/gif" },
    { "extension": ".bmp", "mimeType": "image/bmp" },
    { "extension": ".txt", "mimeType": "text/plain" },
    { "extension": ".rtf", "mimeType": "application/rtf" },
    { "extension": [".ppt", ".pot", ".pps", ".ppa"], "mimeType": "application/vnd.ms-powerpoint" },
    { "extension": ".pptx", "mimeType": "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
    { "extension": ".odp", "mimeType": "application/vnd.oasis.opendocument.presentation" },
    { "extension": ".ods", "mimeType": "application/vnd.oasis.opendocument.spreadsheet" },
    { "extension": ".doc", "mimeType": "application/msword" },
    { "extension": ".docx", "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
    { "extension": ".pdf", "mimeType": "application/pdf" },
    { "extension": [".xls", ".xlt", ".xla", ".xlsb", ".xlsm", ".xltx", ".xltm"], "mimeType": "application/vnd.ms-excel" },
    { "extension": ".xlsx", "mimeType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
    { "extension": ".odt", "mimeType": "application/vnd.oasis.opendocument.text" }
]
function addFile(files, item) {
    let maxSize = item.querySelector('input').getAttribute("data-max-size")
    let accept = item.querySelector('input').getAttribute("accept")
    let fileTypes = []
    if (accept) {
        let acceptArr = accept.split(",").map(item => item.trim().toLowerCase()).filter(item => item !== "");
        allFileTypes.forEach(type => {
            if (Array.isArray(type.extension)) {
                for (const ext of type.extension) {
                    if (acceptArr.includes(ext)) {
                        fileTypes.push(type.mimeType);
                        break;
                    }
                }
            } else if (typeof type.extension === 'string') {
                if (acceptArr.includes(type.extension)) {
                    fileTypes.push(type.mimeType);
                }
            }
        })
        accept = acceptArr.map(item => item.replace(/^\./, '')).join(", ")
    }
    for (let i = 0; i < files.length; i++) {
        let file = files[i]
        if (maxSize && file.size > maxSize * 1024 * 1024) {
            item.querySelector("input").value = ""
            item.classList.add("error")
            item.querySelectorAll(".file-form__item").forEach((el => el.remove()));
            item.querySelector("[data-error]").textContent = `Файл должен быть менее ${maxSize} МБ`
            return
        } else if (accept && fileTypes.length && !fileTypes.includes(file.type)) {
            item.querySelector("input").value = ""
            item.classList.add("error")
            item.querySelectorAll(".file-form__item").forEach((el => el.remove()));
            item.querySelector("[data-error]").textContent = `Разрешённые форматы: ${accept}`
            return
        } else {
            item.classList.remove("error")
            item.querySelector("[data-error]").textContent = ""
            let reader = new FileReader()
            reader.readAsDataURL(file);
            reader.onload = () => {
                item.querySelector(".file-form__items").insertAdjacentHTML("afterbegin", `<div class="file-form__item">
                        <div class="file-form__name">${file.name}</div>
                        <button type="button" class="file-form__del">×</button>
                    </div>`)
            }
            reader.onerror = () => {
                console.log(reader.error);
            }
        }
    }
}
if (document.querySelector(".file-form")) {
    document.querySelectorAll(".file-form").forEach(item => {
        item.querySelector("input").addEventListener("change", e => {
            item.querySelectorAll(".file-form__item").forEach((el => el.remove()));
            let files = e.target.files;
            addFile(files, item)
        })
        //delete file
        item.addEventListener("click", e => {
            item.querySelectorAll(".file-form__del").forEach((del, idx) => {
                if (del.contains(e.target)) {
                    const dt = new DataTransfer()
                    const input = item.querySelector("input")
                    const { files } = input
                    for (let i = 0; i < files.length; i++) {
                        let file = files[i]
                        if (i !== idx) {
                            dt.items.add(file)
                        }
                    }
                    input.files = dt.files
                    setTimeout(() => {
                        del.parentNode.remove()
                    }, 0);
                }
            })
        })
        item.addEventListener("dragenter", e => {
            e.preventDefault();
        })
        item.addEventListener("dragover", e => {
            e.preventDefault();
        })
        item.addEventListener("dragleave", e => {
            e.preventDefault();
        })
        item.addEventListener("drop", function (e) {
            e.preventDefault();
            const dt = new DataTransfer()
            dt.items.add(e.dataTransfer.files[0])
            let files = Array.from(dt.files)
            item.querySelector("input").files = dt.files
            item.querySelectorAll(".file-form__item").forEach((el => el.remove()));
            addFile(files, item)
        });
    })
}