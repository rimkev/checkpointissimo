class Checkpoint {
    #objId
    #timestamp

    constructor(objId, timestamp) {
        this.#objId = objId
        this.#timestamp = Number(timestamp)
    }

    getTimestamp() {
        return Number((this.#timestamp).toFixed(1))
    }

    setTimestamp(newTime) {
        this.#timestamp = Number(newTime.toFixed(1))
    }

    getObjId() {
        return String(this.#objId)
    }

    setObjId(newId) {
        this.#objId = String(newId)
    }
}