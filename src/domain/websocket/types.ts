export enum WebsocketChannelName {
    Reservations = 'reservations',
    Occupancy = 'occupancy',
    Blokmap = 'blokmap',
}

export type WebsocketChannel = {
    name: WebsocketChannelName;
    meta?: Record<string, any>;
};

// Indicates the type of command sent
export enum WebsocketCommandEvent {
    SUBSCRIBE = 'SubscribeRequest',
    UNSUBSCRIBE = 'UnsubscribeRequest',
}

// Data sent through the websocket
export type WebsocketCommand = {
    channel: WebsocketChannel;
    event: WebsocketCommandEvent;
};

// Indicates the type of message received
export enum WebsocketMessageEvent {
    Connected = 'Connected',
    InternalError = 'InternalError',

    SubscribeSuccess = 'SubscribeSuccess',
    UnsubscribeSuccess = 'UnsubscribeSuccess',

    ReservationError = 'ReservationError',
    ReservationCreated = 'ReservationCreated',
    ReservationRejected = 'ReservationRejected',
}

// Data received from the websocket
export type WebsocketMessage<T> = {
    channel: WebsocketChannel;
    event: WebsocketMessageEvent;
    data: T;
};
