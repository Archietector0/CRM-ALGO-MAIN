export class SubTask {
  // Private vars
  #link_id = ''
  #project = ''
  #header = '';
  #description = '';
  #priority = '';
  #performer = '';
  #senior = '';
  #status = 'OPENED';
  
  uuid = ''
  // Constructor
  constructor() {}

  // Get methods
  getLinkId() {
    return this.#link_id;
  }
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
  getStatus() {
    return this.#status;
  }

  // Set methods
  setLinkId(link_id) {
    this.#link_id = link_id ;
  }
  setProject(project) {
    this.#project = project;
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
  setStatus(status) {
    this.#status = status;
  }
}