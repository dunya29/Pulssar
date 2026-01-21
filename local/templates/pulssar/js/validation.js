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
//enable/disable submit btn
const disabledForm = document.querySelectorAll(".disabled-form")
function toggleSubmitBtn(form) {
    const submitBtn = form.querySelector('button[type=submit]');
    const requiredInputs = form.querySelectorAll('input[required]');
    const hasInvalid = [...requiredInputs].some(inp => !isInputValid(inp));
    submitBtn.disabled = hasInvalid;
    submitBtn.style.opacity = hasInvalid ? 0.5 : 1;
    submitBtn.style.pointerEvents = hasInvalid ? 'none' : 'auto';
}
if (disabledForm.length > 0) {
    disabledForm.forEach(form => {
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
            form.addEventListener('submit', e => {
                e.preventDefault();
                let errors = 0;
                requiredInputs.forEach(inp => {
                    if (!isInputValid(inp)) {
                        errors++;
                        formAddError(inp);
                    }
                });
                if (errors === 0) {
                    form.submit();
                }
            });
        }
    })
}
//mask input
const inp = document.querySelectorAll('input[type=tel]')
if (inp) {
    inp.forEach(item => {
        Inputmask(
            {
                mask: "+7 999 999-99-99",
                oncomplete: function () {
                    formRemoveError(item)
                },
            }
        ).mask(item);
    })
}