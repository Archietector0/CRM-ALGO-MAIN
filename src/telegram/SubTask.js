export class SubTask {
  // Private vars
  #link_id = ''
  #header = '';
  #description = '';
  #priority = '';
  #performer = '';
  #assistant = '';

  // Constructor
  constructor(link_id) {
    this.#link_id = link_id
  }

  // Get methods
  getLinkId() {
    return this.#link_id;
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
  getAssistant() {
    return this.#assistant;
  }

  // Set methods
  setLinkId(link_id) {
    this.#link_id = link_id ;
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
  setAssistant(assistant) {
    this.#assistant = assistant;
  }
}