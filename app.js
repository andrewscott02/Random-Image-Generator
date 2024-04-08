$(document).ready(()=>{
    GenerateImage();
})

$("#GeneratedImage-Container").on("click", ()=>{
    AddToCollection();
    GenerateImage();
})

//#region Image Generation

let currentSrc;
let count = 0;

const width = 500;
const height = 300;

function GenerateImage()
{
    currentSrc = GetImageSrc(width, height);

    $("#GeneratedImage-Container").html(`
    <img class="generated-img" src="${currentSrc}?random=${count}.jpg">
    `);

    // let imgWidth = $("#GeneratedImage-Container").children(".generated-img").css("width");
    // let imgHeight = $("#GeneratedImage-Container").children(".generated-img").css("height");

    // $("#GeneratedImage-Container").css("width", imgWidth);
    // $("#GeneratedImage-Container").css("height", imgHeight);

    ShowCollection(width, height);
}

function GetImageSrc(width, height)
{
    let generateSrc = `https://picsum.photos/${width}/${height}`;

    return generateSrc;
}

//#endregion

//#region Collection

const images = []; //TODO: Basic collection, need to assign to profiles

function AddToCollection()
{
    images.push(count);
    count++;
}

function ShowCollection(width, height)
{
    let imageSrcHTML = "";
    for (let i = 0; i < images.length; i++)
    {
        imageSrcHTML += `<img class="generated-img" src="https://picsum.photos/${width}/${height}?random=${i}.jpg">`;
    }

    $("#GeneratedImages-Collection").html(imageSrcHTML);
}

//#endregion

