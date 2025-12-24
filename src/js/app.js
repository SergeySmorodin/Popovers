export class Popover {
  constructor() {
    this.activeTrigger = null;
    this.element = null;
    this.header = null;
    this.body = null;
    this.create();
    this.bindEvents();
  }

  create() {
    this.element = document.createElement("div");
    this.element.className = "popover";

    this.header = document.createElement("div");
    this.header.className = "popover-header";

    this.body = document.createElement("div");
    this.body.className = "popover-body";

    const arrow = document.createElement("div");
    arrow.className = "popover-arrow";

    this.element.append(this.header, this.body, arrow);
    document.body.append(this.element);
  }

  bindEvents() {
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest(".trigger-button");
      if (trigger) {
        e.preventDefault();
        if (this.activeTrigger === trigger) {
          this.hide();
        } else {
          const title = trigger.dataset.popoverTitle;
          const content = trigger.dataset.popoverContent;
          this.show(trigger, title, content);
        }
      } else {
        this.hide();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.hide();
    });
  }

  show(trigger, title, content) {
    this.header.textContent = title;
    this.body.textContent = content;
    this.activeTrigger = trigger;
    this.position(trigger);
    this.element.classList.add("show");
  }

  hide() {
    if (this.element.classList.contains("show")) {
      this.element.classList.remove("show");
      this.activeTrigger = null;
    }
  }

  position(trigger) {
    const rect = trigger.getBoundingClientRect();
    const pw = this.element.offsetWidth;
    const ph = this.element.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    this.element.classList.add("popover-top");

    let left = rect.left + rect.width / 2 - pw / 2;
    let top = rect.top - ph - 10;

    left = Math.max(10, Math.min(left, vw - pw - 10));
    top = Math.max(10, Math.min(top, vh - ph - 10));

    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    new Popover();
  });
}
