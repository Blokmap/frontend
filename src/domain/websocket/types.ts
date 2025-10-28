export type WebsocketChannel = {
    name: 'reservations' | 'occupancy' | 'blokmap';
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
    CONNECTED = 'Connected',
    INTERNAL_ERROR = 'InternalError',

    SUSBCRIBE_SUCCESS = 'SubscribeSuccess',
    UNSUBSCRIBE_SUCCESS = 'UnsubscribeSuccess',

    RESERVATION_ERROR = 'ReservationError',
    RESERVATION_CREATED = 'ReservationCreated',
    RESERVATION_REJECTED = 'ReservationRejected',
}

// Data received from the websocket
export type WebsocketMessage<T> = {
    channel: WebsocketChannel;
    event: WebsocketMessageEvent;
    data: T;
};
