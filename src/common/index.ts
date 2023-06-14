import CustomEventBus from "./eventbus/CustomEventBus";
import EventRegistry from "./registry/EventRegistry";

const eventBus = CustomEventBus.getInstance();

export { eventBus, EventRegistry };
