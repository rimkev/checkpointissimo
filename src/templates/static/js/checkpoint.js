/**
 * Checkpoint class.
 */
export class Checkpoint {
    #objId
    #timestamp

    /**
     * Creates a checkpoint model.
     * @param {string} objId ID of the checkpoint's DOM element.
    * @param {number} timestamp Checkpoint time in seconds.
     */
    constructor(objId, timestamp) {
        this.#objId = objId
        this.#timestamp = Number(timestamp)
    }

    /**
     * Gets the timestamp rounded to one decimal place.
     * @returns {number} Checkpoint time in seconds.
     */
    getTimestamp() {
        return Number((this.#timestamp).toFixed(1))
    }

    /**
     * Sets the timestamp, rounded to one decimal place.
     * @param {number} newTime Checkpoint time in seconds.
     * @returns {void}
     */
    setTimestamp(newTime) {
        this.#timestamp = Number(newTime.toFixed(1))
    }

    /**
     * Gets the checkpoint DOM element ID.
     * @returns {string} Element ID.
     */
    getObjId() {
        return String(this.#objId)
    }

    /**
     * Sets the checkpoint DOM element ID.
    * @param {string} newId Element ID.
     * @returns {void}
     */
    setObjId(newId) {
        this.#objId = String(newId)
    }
}