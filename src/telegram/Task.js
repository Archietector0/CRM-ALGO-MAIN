export class Task {
  // Private vars
  #project = '';
  #header = '';
  #description = '';
  #priority = '';
  #performer = '';
  #senior = '';
  #assistant = '';

  // Constructor
  constructor(senior) {
    this.#senior = senior
  }

  // Get methods
  getProject() {
    return this.#project;
  }
  getHeader() {
    return this.#header;
  }
  getDescription() {
    return this.#description;
  }
  getPriority() {
    return this.#priority;
  }
  getPerformer() {
    return this.#performer;
  }
  getSenior() {
    return this.#senior;
  }
  getAssistant() {
    return this.#assistant;
  }

  // Set methods
  setProject(project) {
    this.#project = project ;
  }
  setHeader(header) {
    this.#header = header;
  }
  setDescription(description) {
    this.#description = description;
  }
  setPriority(priority) {
    this.#priority = priority;
  }
  setPerformer(performer) {
    this.#performer = performer;
  }
  setSenior(senior) {
    this.#senior = senior;
  }
  setAssistant(assistant) {
    this.#assistant = assistant;
  }
}