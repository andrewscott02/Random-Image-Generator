$(document).ready(()=>{
    GenerateImage();
})

let currentSrc;

function GenerateImage()
{
    let width = $("#GeneratedImage-Container").css("width");
    let height = $("#GeneratedImage-Container").css("height");

    console.log(width + " || " + height);

    width = width.replace("px", "");
    height = height.replace("px", "");

    currentSrc = `https://picsum.photos/${width}/${height}`;

    $("#GeneratedImage-Container").html(`
    <img class="generated-img" src="${currentSrc}">
    `);
}

