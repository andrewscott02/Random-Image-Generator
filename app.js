$(document).ready(()=>{
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
}

function GetImageSrc(width, height)
{
    let generateSrc = `https://picsum.photos/${width}/${height}`;

    return generateSrc;
}

//#endregion

//#region Collection

const collection = []; //TODO: Basic collection, need to assign to profiles

function AddToCollection(email)
{
    let emailIndex = GetEmailIndex(email);
    if (emailIndex === false)
    {
        let newUser = {
            user_email: email,
            user_images: []
        }

        console.log("adding new user");

        newUser.user_images.push(count);
        collection.push(newUser);
    }
    else
    {
        console.log("adding image to existing user")
        collection[emailIndex].user_images.push(count);
    }

    count++;
}

function GetEmailIndex(email)
{
    for (let i = 0; i < collection.length; i++)
    {
        if (collection[i].user_email === email)
        {
            return i;
        }
    }

    return false;
}

function ShowCollection()
{
    let imageSrcHTML = ``;
    
    for (let i = 0; i < collection.length; i++)
    {
        imageSrcHTML += `
        <h2>Email: ${collection[i].user_email}</h2>
        <div class="generatedImages-Collection">`;

        for (let j = 0; j < collection[i].user_images.length; j++)
        {
            imageSrcHTML += `<img class="generated-img" src="https://picsum.photos/${width}/${height}?random=${collection[i].user_images[j]}.jpg">`;
        }

        imageSrcHTML += "</div>"
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
    let emailString = $("#email").val();
    let message = GetEmailMessage(emailString);

    if(message !== "")
    {
        canSubmit = false;
    }

    if (canSubmit)
    {
        //TODO: Submit form
        OnSubmitEmail(emailString);
        //ClearFormFields();
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

function OnSubmitEmail(email)
{
    console.log("Saving pictures to " + email);
    AddToCollection(email);
    GenerateImage();
    ShowCollection();
}

//#endregion

