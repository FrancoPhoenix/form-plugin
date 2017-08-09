class Errors {
    /**
     * Create a new Errors instance.
     */
    constructor () {
        this.errors = {}
    }

    /**
     * Determine if an errors exists for the given field.
     *
     * @param {string} field
     */
    has (field) {
        for (let index in this.errors) {
            if (index.indexOf(field + '.') >= 0) {
                return true
            }
        }

        return this.errors.hasOwnProperty(field)
    }

    /**
     * Determine if we have any errors.
     */
    any () {
        return Object.keys(this.errors).length > 0
    }

    /**
     * Retrieve the error message for a field.
     *
     * @param {string} field
     */
    get (field) {
        let result = ''

        if (field) {
            for (let index in this.errors) {
                if (index.indexOf(field) >= 0) {
                    for (let message of this.errors[index]) {
                        result += message + '\n'
                    }
                }
            }
        }

        return result
    }

    /**
     * Retrieve all errors for a field in an array.
     *
     * @param field
     * @returns {Array}
     */
    getAll (field) {
        let result = []

        if (field) {
            for (let index in this.errors) {
                if (index.indexOf(field) >= 0) {
                    for (let message of this.errors[index]) {
                        result.push(message)
                    }
                }
            }
        }

        return result
    }

    /**
     * Record the new errors.
     *
     * @param {object} errors
     */
    record (errors) {
        this.errors = errors
    }

    /**
     * Clear one or all error fields.
     *
     * @param {string|null} field
     */
    clear (field) {
        let errors = {}

        if (field) {
            errors = JSON.parse(JSON.stringify(this.errors))

            for (let index in errors) {
                if (index.indexOf(field + '.') >= 0) {
                    delete errors[index]
                }
            }

            delete errors[field]
        }

        this.errors = errors
    }
}

export default Errors
