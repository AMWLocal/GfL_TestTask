
const bntMod = document.querySelector('.modal-btn'),
    modalDialog = document.querySelector('.modal'),
    closeModal = document.querySelectorAll('.btn-close'),
    btnSubmit = document.querySelector('.btn-submit'),
    formData = document.querySelector('.form-contact'),
    table = document.querySelector('table'),
    tableContent = document.querySelector('tbody'),
    modalFieldTel = document.querySelector('.tel'),
    modalFieldName = document.querySelector('.name'),
    modalFieldMail = document.querySelector('.email'),
    modalFieldAddress = document.querySelector('.address'),
    search = document.querySelector('.search')

class ContactInfo {
    constructor(phone, name, mail, address) {
        this.phone = phone;
        this.name = name;
        this.mail = mail;
        this.address = address;

    }
}

class ContactList {
    constructor(contacts) {
        this.contacts = contacts
    }

    createContact(contact) {
        this.contacts.set(contact.phone,
            new ContactInfo(contact.phone, contact.name, contact.email, contact.address)
        )
        this.render()
    }

    createTd(data) {
        let td = document.createElement('td')
        td.textContent = data
        return td
    }

    createOperation(key) {
        let td = document.createElement('td')
        let bEdit = document.createElement('button')
        let bDelete = document.createElement('button')
        bDelete.addEventListener('click', () => {
            this.contacts.delete(key)
            this.render()
        })
        bEdit.addEventListener('click', () => {
            let contact = this.contacts.get(key)
            openModal(contact)
        })
        bEdit.className = 'btn-edit'
        bDelete.className = 'btn-delete'
        bEdit.textContent = 'Edit'
        bDelete.textContent = 'Delete'
        let delimetr = document.createElement('span')
        delimetr.textContent = '|'
        td.append(bEdit, delimetr, bDelete)
        return td
    }

    render(search) {
        tableContent.innerHTML = ''
        if (this.contacts.size === 0) {
            let emptyTr = document.createElement('tr')
            let emptyTd = document.createElement('td')
            emptyTd.textContent = 'Empty list'
            emptyTr.append(emptyTd)
            tableContent.append(emptyTr)
        } else {
            Array.from(this.contacts.values())
                .filter((contact) => {
                    if (search === undefined) return true
                    return contact.phone.includes(search)
                        || contact.name.includes(search)
                        || contact.mail.includes(search)
                        || contact.address.includes(search)
                })
                .forEach((contact) => {
                    let tr = document.createElement('tr')

                    tr.append(this.createTd(contact.phone))
                    tr.append(this.createTd(contact.name))
                    tr.append(this.createTd(contact.mail))
                    tr.append(this.createTd(contact.address))
                    tr.append(this.createOperation(contact.phone))
                    tableContent.append(tr)
                })
        }
    }
}

let list = new ContactList(new Map())
list.render()

btnSubmit.addEventListener('click', (e) => {
    e.preventDefault()
    list.createContact(Object.fromEntries(new FormData(formData).entries()))
    hideModal()
})

function hideModal() {
    modalDialog.style.display = 'none'
    formData.reset()
}
function openModal(contact) {
    if (contact !== undefined) {
        modalFieldTel.value = contact.phone
        modalFieldName.value = contact.name
        modalFieldMail.value = contact.mail
        modalFieldAddress.value = contact.address
    }
    modalDialog.style.display = 'block'
}
document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
        hideModal()
    }
})
bntMod.addEventListener('click', () => openModal());

closeModal.forEach(element => {
    element.addEventListener('click', hideModal);
});

modalDialog.addEventListener('click', (e) => {
    if (e.target === modalDialog) {
        hideModal()
    }
})


search.addEventListener('input', (e) => {

    list.render(e.target.value)
})

