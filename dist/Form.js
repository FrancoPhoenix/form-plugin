import Errors from './Errors'

class Form {
    /**
     * Create a new Form instance.
     *
     * @param {object} data
     */
    constructor (data) {
        this.originalData = data
        this.inProgress = false
        this.formData = false

        for (let field in data) {
            this[field] = data[field]
        }

        this.errors = new Errors()
    }

    /**
     * Fetch all relevant data for the form.
     */
    data () {
        let data = {}

        for (let property in this.originalData) {
            data[property] = this[property]
        }

        return data
    }

    /**
     * Fetch all relevant data for the form in FormData.
     */
    dataForm () {
        let data = new FormData()

        for (let property in this.originalData) {
            switch(true) {
                case typeof this[property] === 'boolean':
                    data.append(property, this[property] ? '1' : '0')

                    break
                case this[property] instanceof FileList:

                    for (let file of this[property]) {
                        data.append(property + '[]', file)
                    }

                    break
                case this[property] === null:
                    data.append(property, '')

                    break
                default:
                    data.append(property, this[property])
            }
        }

        return data
    }

    /**
     * Load all relevant data for the form.
     *
     * @param {object} data
     */
    load (data) {
        for (let property in this.originalData) {
            if (typeof data[property] !== 'undefined') {
                this[property] = data[property]
            }
        }
    }

    /**
     * Reset the form fields.
     */
    reset () {
        if (typeof CKEDITOR != 'undefined') {
            for (let editor in CKEDITOR.instances) {
                CKEDITOR.instances[editor].setData( '', function() { this.updateElement() })
            }
        }

        for (let field in this.originalData) {
            this[field] = ''
        }

        this.errors.clear()
    }

    /**
     * Send a POST request to the given URL.
     * .
     * @param {string} url
     */
    post (url) {
        return this.submit('post', url)
    }

    /**
     * Send a PUT request to the given URL.
     * .
     * @param {string} url
     */
    put (url) {
        return this.submit('put', url)
    }

    /**
     * Send a PATCH request to the given URL.
     * .
     * @param {string} url
     */
    patch (url) {
        return this.submit('patch', url)
    }

    /**
     * Send a DELETE request to the given URL.
     * .
     * @param {string} url
     */
    delete (url) {
        return this.submit('delete', url)
    }

    /**
     * Submit the form.
     *
     * @param {string} requestType
     * @param {string} url
     */
    submit (requestType, url) {
        this.errors.clear()
        this.inProgress = true
        let data = this.data()

        if (this.formData) {
            data = this.dataForm()
            data.append('_method', requestType)
            requestType = 'post'
        }

        return new Promise((resolve, reject) => {
            axios[requestType](url, data)
                .then(response => {
                    this.inProgress = false

                    resolve(response.data)
                })
                .catch(error => {
                    this.inProgress = false
                    this.errors.record(error.response.data)

                    reject(error.response.data)
                })
        })
    }
}

export default Form
