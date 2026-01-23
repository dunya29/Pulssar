// formReset
function formReset(form,errorClean = false) {
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