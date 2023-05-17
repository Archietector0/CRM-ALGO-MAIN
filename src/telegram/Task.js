export class Task {
  // Private vars
  #project = '';
  #header = '';
  #description = '';
  #priority = '';
  #performer = '';
  #senior = '';
  #assistant = '';
  #status = 'OPENED';
  #linkId = ''

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
  getStatus() {
    return this.#status
  }
  getLinkId() {
    return this.#linkId
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
  setLinkId(linkId) {
    this.#linkId = linkId;
  }
  setStatus(status) {
    this.#status = status;
  }
}