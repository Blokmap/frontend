export type AdminCounts = {
    profileCount: number;
    institutionCount: number;
    authorityCount: number;
    locationCount: number;
    pendingLocationCount: number;
};

export type AdminStats = {
    userGrowth: number;
    locationGrowth: number;
    reservationGrowth: number;
    averageReservationsPerUser: number;
    averageLocationsPerAuthority: number;
};
