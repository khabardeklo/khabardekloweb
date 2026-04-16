type ImageResizeModuleOptions = {
  handleSize?: number;
  minWidth?: number;
  maxWidth?: number;
};

class QuillImageResizeModule {
  quill: any;
  options: Required<ImageResizeModuleOptions>;
  overlay: HTMLDivElement | null = null;
  img: HTMLImageElement | null = null;
  resizing = false;
  startX = 0;
  startY = 0;
  startWidth = 0;
  startHeight = 0;
  aspectRatio = 1;
  activeHandle = "";

  constructor(quill: any, options: ImageResizeModuleOptions = {}) {
    this.quill = quill;
    this.options = {
      handleSize: options.handleSize ?? 12,
      minWidth: options.minWidth ?? 1,
      maxWidth: options.maxWidth ?? 4000,
    };

    this.handleImageClick = this.handleImageClick.bind(this);
    this.handleHandleMouseDown = this.handleHandleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);

    this.quill.root.addEventListener("click", this.handleImageClick);
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("resize", this.handleWindowResize);
  }

  handleImageClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (target?.tagName === "IMG" && this.quill.root.contains(target)) {
      this.showResize(target as HTMLImageElement);
      return;
    }

    if (this.overlay && this.overlay.contains(target)) {
      return;
    }

    this.hideResize();
  }

  showResize(img: HTMLImageElement) {
    this.img = img;
    this.createOverlay();
    this.updateOverlayPosition();
  }

  hideResize() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    this.img = null;
    this.resizing = false;
  }

  createOverlay() {
    if (this.overlay) {
      return;
    }

    const container = this.quill.root.parentElement || this.quill.root;
    if (getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }

    this.overlay = document.createElement("div");
    this.overlay.style.cssText = `
      position: absolute;
      border: 2px dashed #0f172a;
      box-sizing: border-box;
      pointer-events: none;
      z-index: 50;
    `;

    const handles = ["nw", "ne", "se", "sw"];
    const positions: Record<string, string> = {
      nw: "left: -8px; top: -8px; cursor: nwse-resize;",
      ne: "right: -8px; top: -8px; cursor: nesw-resize;",
      se: "right: -8px; bottom: -8px; cursor: nwse-resize;",
      sw: "left: -8px; bottom: -8px; cursor: nesw-resize;",
    };

    handles.forEach((pos) => {
      const handle = document.createElement("div");
      handle.setAttribute("data-handle", pos);
      handle.style.cssText = `
        position: absolute;
        width: ${this.options.handleSize}px;
        height: ${this.options.handleSize}px;
        border-radius: 50%;
        background: #0f172a;
        border: 2px solid #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        pointer-events: auto;
        ${positions[pos]}
      `;
      handle.addEventListener("mousedown", this.handleHandleMouseDown);
      this.overlay!.appendChild(handle);
    });

    container.appendChild(this.overlay);
  }

  handleHandleMouseDown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const handle = event.target as HTMLElement;
    this.activeHandle = handle.getAttribute("data-handle") || "se";

    if (!this.img) {
      return;
    }

    this.resizing = true;
    this.startX = event.clientX;
    this.startY = event.clientY;

    const rect = this.img.getBoundingClientRect();
    this.startWidth = rect.width;
    this.startHeight = rect.height;
    this.aspectRatio = this.startWidth / this.startHeight;
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.resizing || !this.img) {
      return;
    }

    const deltaX = event.clientX - this.startX;
    let newWidth: number;

    if (this.activeHandle === "nw" || this.activeHandle === "sw") {
      newWidth = Math.max(this.options.minWidth, Math.min(this.options.maxWidth, this.startWidth - deltaX));
    } else {
      newWidth = Math.max(this.options.minWidth, Math.min(this.options.maxWidth, this.startWidth + deltaX));
    }

    const newHeight = Math.round(newWidth / this.aspectRatio);

    this.img.width = newWidth;
    this.img.height = newHeight;
    this.img.style.width = `${newWidth}px`;
    this.img.style.height = `${newHeight}px`;

    this.updateOverlayPosition();
  }

  handleMouseUp() {
    this.resizing = false;
  }

  handleWindowResize() {
    this.updateOverlayPosition();
  }

  updateOverlayPosition() {
    if (!this.overlay || !this.img) {
      return;
    }

    const container = this.quill.root.parentElement || this.quill.root;
    const containerRect = container.getBoundingClientRect();
    const imgRect = this.img.getBoundingClientRect();

    Object.assign(this.overlay.style, {
      left: `${imgRect.left - containerRect.left}px`,
      top: `${imgRect.top - containerRect.top}px`,
      width: `${imgRect.width}px`,
      height: `${imgRect.height}px`,
    });
  }
}

export function registerQuillImageResize(Quill: any) {
  if (!Quill || (Quill as any).__simpleImageResizeRegistered) {
    return;
  }

  Quill.register("modules/imageResize", QuillImageResizeModule);
  (Quill as any).__simpleImageResizeRegistered = true;
}
