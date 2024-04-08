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

//#region Form Validation

$(".form-sbmt").on("click", (event)=>{
    CheckFormFields(event);
})

$("input").on("keypress", (event)=>{
    if (event.which == 13)
    {
        CheckFormFields(event);
    }
})

function CheckFormFields(event)
{
    event.preventDefault();
    let canSubmit = true;
    let message = GetEmailMessage($("#email").val());
    
    if(message !== "")
    {
        canSubmit = false;
    }

    if (canSubmit)
    {
        //TODO: Submit form
        alert("TODO: Submit");
        ClearFormFields();
    }
    else
    {
        alert(message);
    }
}

function ClearFormFields()
{
    $("input").each((index, element)=>{
        $(element).val("");
    });
}

const emailChecks =
[
    //Does not end on .
    {
        message: "'.' is used at the wrong position in the email address",
        regexCheck: [/\.$/, /@+\./],
        required: false
    },

    //Text after @
    {
        message: "Please enter some text after the '@' in the email address",
        regexCheck: [/@+\S/],
        required: true
    },

    //Includes @
    {
        message: "Please include an '@' in the email address",
        regexCheck: [/\S+@/],
        required: true
    }
]

function GetEmailMessage(input)
{
    message = "";

    for (let i= 0; i < emailChecks.length; i++)
    {
        let success = true;

        for (let j = 0; j < emailChecks[i].regexCheck.length; j++)
        {
            let match = input.match(emailChecks[i].regexCheck[j]) ? true : false;
            match = match == emailChecks[i].required;

            if (match == false)
            {
                success = false;
            }
        }

        if (!success)
        {
            //alert(emailChecks[i].message);
            message = emailChecks[i].message;
        }
    }

    if (input === "")
    {
        message = "Please include an email address";
    }
    
    return message;
}

//#endregion

