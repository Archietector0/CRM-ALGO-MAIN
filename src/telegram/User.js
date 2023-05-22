export class User {
  // Private vars
  #firstName = undefined 
  #userId = undefined 
  #userName = undefined 
  #action = undefined 
  #mainMsgId = undefined 
  #state = undefined 
  #subTask = undefined 
  #task = undefined 

  // Constructor
  constructor ({
    firstName,
    userId,
    userName,
    action,
    mainMsgId,
    state,
    subTask,
    task
  }) {
    this.#firstName = firstName
    this.#userId = userId
    this.#userName = userName
    this.#action = action
    this.#mainMsgId = mainMsgId
    this.#state = state
    this.#subTask = subTask
    this.#task = task
  }


  // getMethods
  getFirstName() {
    return this.#firstName
  }

  getUserName() {
    return this.#userName
  }

  getUserId() {
    return this.#userId
  }

  getAction() {
    return this.#action
  }

  getMainMsgId() {
    return this.#mainMsgId
  }

  getState() {
    return this.#state
  }

  getSubTask() {
    return this.#subTask
  }

  getTask() {
    return this.#task
  }

  // setMethods
  setFirstName(firstName) {
    this.#firstName = firstName
  }

  setUserName(userName) {
    this.#userName = userName
  }

  setUserId(userId) {
    this.#userId = userId 
  }

  setAction(action) {
    this.#action = action
  }

  setMainMsgId(mainMsgId) {
    this.#mainMsgId = mainMsgId
  }

  setState(state) {
    this.#state = state
  }

  setSubTask(subTask) {
    this.#subTask = subTask
  }

  setTask(task) {
    this.#task = task
  }
}