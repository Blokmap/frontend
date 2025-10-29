export enum LocationPermission {
    // Admin privileges, member can do everything
    Administrator = 1 << 0,

    // Member can manage images for this location
    // - upload new images
    // - reorder images
    // - delete images
    ManageImages = 1 << 1,

    // Member can manage opening times for this location
    // - create opening times
    // - update opening times
    // - delete opening times
    ManageOpeningTimes = 1 << 2,

    // Member can manage location members and their permissions
    // - Add members
    // - Update member roles
    // - Remove members
    ManageMembers = 1 << 3,

    // Member can manage reservations for this location
    ManageReservations = 1 << 4,
}

export enum AuthorityPermission {
    // Admin privileges, member can do everything
    Administrator = 1 << 0,

    // Member can submit new locations under this authority
    AddLocations = 1 << 1,
    // Member can approve/reject all locations under this authority
    ApproveLocations = 1 << 2,
    // Member can delete all locations under this authority
    DeleteLocations = 1 << 3,

    // Member can manage authority members and their permissions
    // - Add members
    // - Update member roles
    // - Remove members
    ManageMembers = 1 << 4,
}

export enum InstitutionPermission {
    // Admin privileges, member can do everything
    Administrator = 1 << 0,

    // Member can create or link new authorities under this institution
    AddAuthority = 1 << 1,
    // Member can delete authorities under this institution
    DeleteAuthority = 1 << 2,

    // Member can manage institution members and their permissions
    // - Add members
    // - Update member roles
    // - Remove members
    ManageMembers = 1 << 3,
}
