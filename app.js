$(document).ready(()=>{
    GenerateImage();
})

//#region Image Generation

let currentSrc;
let count = 0;

const imgWidth = 500;
const imgHeight = 300;

function GenerateImage()
{
    console.log("Fetching image");
    
    fetch(`https://picsum.photos/${imgWidth}/${imgHeight}`)
        .then(response => { CheckStatus(response); })
        .then(imgURL => { SetContainerHTML(imgURL); })
        .catch(error => {
            console.error("An Error Occured: ", error.message);
        });
}

function CheckStatus(response)
{
    console.log("Checking status; " + response);
    if (response.ok)
    {
        Promise.resolve(response);
        return response.url;
    }
    else
    {
        Promise.reject(new Error(response.statusText));
    }
}

function SetContainerHTML(imgSRC)
{
    console.log("Got image source: " + imgSRC);
    $("#GeneratedImage-Container").html(`
        <img class="generated-img" src="${imgSRC}?random=${count}.jpg">
    `);
}

//#endregion

//#region Drop List

function AddToDropListDropList(newEmail)
{
    let optionsHTML = $("#DropList").children("optgroup").html();

    optionsHTML += `
        <option class="option" value="${newEmail}">${newEmail}</option>
        `;

    $("#DropList").children("optgroup").html(optionsHTML);

    GetSelectedItem();

    let emailIndex = GetEmailIndex(newEmail);

    SmoothScrollToID(`#EMAIL_${emailIndex}`)
}

$('#DropList').change((event)=>{
    console.log(event.target);
    GetSelectedItem();
})

function GetSelectedItem()
{
    let currentlySelected = $('#DropList').val();
    ShowCollection(currentlySelected);

    let emailIndex = GetEmailIndex(currentlySelected);

    emailIndex = emailIndex == false ? 0 : emailIndex;

    SmoothScrollToID(`#EMAIL_${emailIndex}`)

    return currentlySelected;
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

        newUser.user_images.push(count);
        collection.push(newUser);

        AddToDropListDropList(email);
    }
    else
    {
        collection[emailIndex].user_images.push(count);
    }

    count++;
}

function GetEmailIndex(email)
{
    if (email === "")
    {
        return false;
    }

    for (let i = 0; i < collection.length; i++)
    {
        if (collection[i].user_email === email)
        {
            return i;
        }
    }

    return false;
}

function ShowCollection(email="")
{
    let imageSrcHTML = ``;
    
    emailIndex = GetEmailIndex(email);

    //If email is not specified or invalid, show entire collection
    if (emailIndex === false)
    {
        for (let i = 0; i < collection.length; i++)
        {
            imageSrcHTML += GetEmailHTML(i);
        }
    }
    else //Runs if email is valid
    {
        imageSrcHTML += GetEmailHTML(emailIndex);
    }

    $("#GeneratedImages-Collection").html(imageSrcHTML);
}

function GetEmailHTML(index)
{
    let imageSrcHTML = `
        <h2>Email: ${collection[index].user_email}</h2>
        <div id="EMAIL_${index}" class="generatedImages-Collection">`;

    for (let i = 0; i < collection[index].user_images.length; i++)
    {
        imageSrcHTML += `
        <div class="collection-img-container">
        <img class="generated-img" src="https://picsum.photos/${imgWidth}/${imgHeight}?random=${collection[index].user_images[i]}.jpg">
        </div>`;
    }

    imageSrcHTML += "</div>"

    return imageSrcHTML;
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
        OnSubmitEmail(emailString);
    }
    else
    {
        alert(message);
    }
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
    },

    //Doesn't include special characters eg. [ ] ( ) , ; : < > | or = 
    {
        message: "Please do not include and special characters in the email address eg. [ ] ( ) , ; : < > | or = ",
        regexCheck: [/[,:;=|\[\]<>()]/],
        required: false
    },

    //Doesn't include spaces
    {
        message: "Please do not include any spaces in the email address",
        regexCheck: [/\s/],
        required: false
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
    AddToCollection(email);
    GenerateImage();
    ShowCollection();
}

//#endregion

//#region Smooth Scroll

function SmoothScrollToID(ID)
{
    console.log("Smooth scrolling to ID: " + ID);
    $('html, body').animate({
        scrollTop: $(`${ID}`).offset().top
    }, 500);
}

//#endregion

