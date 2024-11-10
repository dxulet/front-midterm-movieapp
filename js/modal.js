export class Modal {
  constructor() {
    this.modal = document.querySelector(".modal");
    this.modalBody = document.querySelector(".modal-body");
    this.closeButton = document.querySelector(".close-modal");
    this.setupListeners();
  }

  setupListeners() {
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.close();
    });
    this.closeButton.addEventListener("click", () => this.close());
  }

  show(content) {
    this.modalBody.innerHTML = content;
    this.modal.style.display = "flex";
  }

  close() {
    this.modal.style.display = "none";
  }
}