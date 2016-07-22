import "es6-shim";
import "reflect-metadata";
import {constructorToPlain, plainToClass, plainArrayToClassArray} from "../../src/index";
import {Photo} from "./Photo";

// check deserialization

let photoJson = {
    id: "1",
    filename: "myphoto.jpg",
    description: "about my photo",
    tags: [
        "me",
        "iam"
    ],
    author: {
        id: "2",
        firstName: "Johny",
        lastName: "Cage"
    },
    albums: [{
        id: "1",
        name: "My life"
    },
    {
        id: "2",
        name: "My young years"
    }]
};

let photo = plainToClass<Photo>(Photo, photoJson);
console.log("deserialized object: " , photo);

// now check serialization

let newPhotoJson = constructorToPlain(photo);
console.log("serialized object: " , newPhotoJson);

// try to deserialize an array
console.log("-------------------------------");

let photosJson = [{
    id: "1",
    filename: "myphoto.jpg",
    description: "about my photo",
    author: {
        id: "2",
        firstName: "Johny",
        lastName: "Cage",
        registrationDate: "1995-12-17T03:24:00"
    },
    albums: [{
        id: "1",
        name: "My life"
    },
    {
        id: "2",
        name: "My young years"
    }]
},
{
    id: "2",
    filename: "hisphoto.jpg",
    description: "about his photo",
    author: {
        id: "2",
        firstName: "Johny",
        lastName: "Cage"
    },
    albums: [{
        id: "1",
        name: "My life"
    },
    {
        id: "2",
        name: "My young years"
    }]
}];

let photos = plainArrayToClassArray(Photo, photosJson);
console.log("deserialized array: " , photos);

// now check array serialization

let newPhotosJson = constructorToPlain(photos);
console.log("serialized array: " , newPhotosJson);