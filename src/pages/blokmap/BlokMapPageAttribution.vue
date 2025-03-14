<template>
    <div id="attribution">
        <div>
            <i18n-t keypath="pages.blokmap.attribution.osm">
                <template #link>
                    <a href="https://openstreetmap.org/copyright" class="styled"> OpenStreetMap </a>
                </template>
            </i18n-t>
        </div>
        &bull;
        <div>
            <i18n-t keypath="pages.blokmap.attribution.carto">
                <template #link>
                    <a href="https://carto.com/basemaps" class="styled"> CARTO </a>
                </template>
            </i18n-t>
        </div>
    </div>
</template>

<style lang="scss" scoped>
#attribution {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.25rem;
    background: rgba(white, 0.5);
    padding: 0.25rem;
    font-size: 12px;
}
</style>
