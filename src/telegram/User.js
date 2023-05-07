export class User {
  // Private vars
  #firstName = 'None'
  #tasks = []
  #userId = 0
  #userName = 'None'
  
  // Public vars
  action = 'None'
  mainMsgId = 0
  state = 'None'
  subTask = undefined

  // Constructor
  constructor ({ firstName, userName, userId, mainMsgId, tasks }) {
    this.#firstName = firstName
    this.#userName = userName
    this.#userId = userId
    this.mainMsgId = mainMsgId
    this.#tasks = tasks
  }

  addTask(task) {
    this.#tasks.push(task);
  }

  // Get methods
  getLastTask() {
    return this.#tasks.at(-1);
  }

  getAllTasks() {
    return this.#tasks;
  }

  getFirstName() {
    return this.#firstName
  }

  getUserName() {
    return this.#userName
  }

  getUserId() {
    return this.#userId
  }

  // Remove
  removeLastTask() {
    this.#tasks.pop();
  }
}