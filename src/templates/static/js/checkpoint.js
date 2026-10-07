/*
Copyright (C) 2026 Rimantas Rimkevičius

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see https://www.gnu.org/licenses/
*/

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