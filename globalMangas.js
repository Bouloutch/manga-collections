var jsonfile = require('jsonfile');
var fs = require('fs')

//global functions used everywhere

exports.filterMangasList2 = function (listMangas, collectionFilter, locationFilter) {
    var listMangasFiltered = [];
    if (collectionFilter == "" && locationFilter == "") {
        listMangasFiltered = listMangas;
        // return {mangas: listMangasFiltered, collections: listCollections, locations: listLocations}; 
    }

    listMangas.forEach(function (element) {
        if (collectionFilter == "") {
            if (element.location == locationFilter) {
                listMangasFiltered.push(element);
            }
        } else if (locationFilter == "") {
            if (element.collection == collectionFilter) {
                listMangasFiltered.push(element);
            }
        } else if (element.collection == collectionFilter && element.location == locationFilter) {
            listMangasFiltered.push(element);
        }
    });
    return listMangasFiltered;
}