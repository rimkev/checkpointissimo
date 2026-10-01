import * as common from './common-functions.js'
import {Checkpoint} from './checkpoint.js'
import {state} from './state.js'

/**
 * Creates a checkpoint, draws it, and stores it in timestamp order.
 * @param {number} timeSec Checkpoint time in seconds.
 * @returns {void}
 */
export function createCheckpoint(timeSec) {
    if (state.videos.length === 0)
        return

    // checkpoint <div> element
    const newDiv = document.createElement('div')
    newDiv.className = 'cp-div'
    newDiv.id = `${crypto.randomUUID()}` // generates random ID, needed for later removal of div

    // new CP <a> element
    const newCP = document.createElement('a')
    newCP.textContent = getTextFromSec(timeSec)
    newCP.href = '#'
    newCP.title = `Press to jump to ${newCP.textContent}`
    newCP.addEventListener('click', function(event) {
        event.preventDefault()
        common.rewind(timeSec)
    })

    // its individual deletion button
    const newDelBtn = document.createElement('button')
    newDelBtn.type = 'button'
    newDelBtn.title = 'Delete this checkpoint'
    newDelBtn.className = 'cp-del-btn'
    const newDelIcon = document.createElement('i')
    newDelIcon.setAttribute('data-lucide', 'trash')
    newDelIcon.className = 'cp-del-icon'
    newDelBtn.append(newDelIcon)
    newDelBtn.addEventListener('click', function() {
        // delete from the screen
        newDiv.remove()
        // remove from checkpoints list
        removeCheckpointFromList(newDiv.id)
        // update cookie
        common.writeCookie('checkpoints', state.checkpoints.map(cp => cp.getTimestamp()))
    })

    // add <a> and <button> into <div>
    newDiv.append(newCP, newDelBtn)

    // insert into list and section where needed (timestamp order)
    insertCheckpointElementInHTML(newDiv, timeSec)
    insertCheckpointInList(newDiv.id, timeSec)

    // create icon svgs
    lucide.createIcons()

    // update cookie
    common.writeCookie('checkpoints', state.checkpoints.map(cp => cp.getTimestamp()))
}



/**
 * Inserts the checkpoint element at its timestamp-sorted position.
 * @param {HTMLElement} cpDivElement Checkpoint element to insert.
 * @param {number} timeSec Checkpoint time in seconds.
 * @returns {void}
 */
function insertCheckpointElementInHTML(cpDivElement, timeSec) {
    const insertBeforeIndex = common.getCheckpointIndexForInsertion(timeSec)
    const section = document.getElementById('checkpoint-section')
    section.insertBefore(cpDivElement, section.children[insertBeforeIndex])
}




/**
 * Inserts a checkpoint object at its timestamp-sorted position.
 * @param {string} cpDivId Checkpoint element ID.
 * @param {number} timeSec Checkpoint time in seconds.
 * @returns {void}
 */
function insertCheckpointInList(cpDivId, timeSec) {
    const insertBeforeIndex = common.getCheckpointIndexForInsertion(timeSec)
    state.checkpoints.splice(insertBeforeIndex, 0, new Checkpoint(cpDivId, timeSec))
}



/**
 * Removes a checkpoint from the list by its element ID.
 * @param {string} cpDivId Checkpoint element ID.
 * @returns {void}
 */
function removeCheckpointFromList(cpDivId) {
    const itemIndex = state.checkpoints.findIndex(cp => cp.getObjId() === String(cpDivId))
    if (itemIndex === -1)
        return
    state.checkpoints.splice(itemIndex, 1)
}




/**
 * Formats seconds as a timestamp string.
 * @param {number} timeSec Time in seconds.
 * @returns {string} Formatted timestamp.
 */
function getTextFromSec(timeSec) {
    const date = new Date(timeSec * 1000)
    return `${date.toISOString().slice(11, 19)}${(timeSec % 1).toFixed(1).substring(1)}`
}