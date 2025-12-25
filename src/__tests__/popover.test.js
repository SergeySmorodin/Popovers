import { Popover } from "../js/app";

describe("Popover", () => {
  let popover;

  beforeEach(() => {
    document.body.innerHTML = "";
    popover = new Popover();
  });

  afterEach(() => {
    if (popover?.element?.parentNode) {
      popover.element.remove();
    }
  });

  test("проверяем DOM-структуру при инициализации", () => {
    expect(document.querySelector(".popover")).not.toBeNull();
    expect(document.querySelector(".popover-header")).not.toBeNull();
    expect(document.querySelector(".popover-body")).not.toBeNull();
    expect(document.querySelector(".popover-arrow")).not.toBeNull();
    expect(popover.element.classList.contains("show")).toBe(false);
  });

  test("проверка наличия поповера при клике на кнопку", () => {
    const trigger = document.createElement("button");
    trigger.className = "trigger-button";
    trigger.dataset.popoverTitle = "Test Title";
    trigger.dataset.popoverContent = "Test Content";
    document.body.append(trigger);

    trigger.click();

    expect(popover.element.classList.contains("show")).toBe(true);
    expect(popover.header.textContent).toBe("Test Title");
    expect(popover.body.textContent).toBe("Test Content");
    expect(popover.activeTrigger).toBe(trigger);
  });

  test("скрывает поповер при повторном клике по той же кнопке", () => {
    const trigger = document.createElement("button");
    trigger.className = "trigger-button";
    trigger.dataset.popoverTitle = "Title";
    trigger.dataset.popoverContent = "Content";
    document.body.append(trigger);

    trigger.click();
    expect(popover.element.classList.contains("show")).toBe(true);

    trigger.click();
    expect(popover.element.classList.contains("show")).toBe(false);
    expect(popover.activeTrigger).toBeNull();
  });

  test("проверка скрытия поповера при клике вне его области", () => {
    const trigger = document.createElement("button");
    trigger.className = "trigger-button";
    trigger.dataset.popoverTitle = "Title";
    trigger.dataset.popoverContent = "Content";
    document.body.append(trigger);

    trigger.click();
    expect(popover.element.classList.contains("show")).toBe(true);

    document.body.click();

    expect(popover.element.classList.contains("show")).toBe(false);
    expect(popover.activeTrigger).toBeNull();
  });

  test("проверка скрытия поповера при нажатии Escape", () => {
    const trigger = document.createElement("button");
    trigger.className = "trigger-button";
    trigger.dataset.popoverTitle = "Title";
    trigger.dataset.popoverContent = "Content";
    document.body.append(trigger);

    trigger.click();
    expect(popover.element.classList.contains("show")).toBe(true);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(popover.element.classList.contains("show")).toBe(false);
    expect(popover.activeTrigger).toBeNull();
  });

  test("не показывает поповер для элементов, не являющихся триггерами", () => {
    const button = document.createElement("button");
    button.textContent = "Not a trigger";
    document.body.append(button);

    button.click();

    expect(popover.element.classList.contains("show")).toBe(false);
    expect(popover.activeTrigger).toBeNull();
  });

  test("проверка позиционирования поповера над триггером", () => {
    const trigger = document.createElement("button");
    trigger.className = "trigger-button";
    trigger.dataset.popoverTitle = "Title";
    trigger.dataset.popoverContent = "Content";
    document.body.append(trigger);

    // Подменяем размеры
    jest.spyOn(trigger, "getBoundingClientRect").mockReturnValue({
      left: 100,
      top: 200,
      width: 100,
      height: 40,
      right: 200,
      bottom: 240,
    });

    Object.defineProperty(popover.element, "offsetWidth", {
      value: 200,
      configurable: true,
    });
    Object.defineProperty(popover.element, "offsetHeight", {
      value: 100,
      configurable: true,
    });

    trigger.click();

    // left = 100 + 100/2 - 200/2 = 50
    // top = 200 - 100 - 10 = 90
    expect(popover.element.style.left).toBe("50px");
    expect(popover.element.style.top).toBe("90px");
  });
});
