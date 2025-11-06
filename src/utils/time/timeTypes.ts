export type Time = {
    hours: number;
    minutes: number;
};

export type TimeRange = {
    startTime: Time;
    endTime: Time;
};

export type TimeGranularity = 'hours' | 'minutes';
