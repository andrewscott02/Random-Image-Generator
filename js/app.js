$(document).ready(()=>{
    GenerateImage();
})

//#region Image Generation

let currentSrc;
let count = 0;

const imgWidth = 500;
const imgHeight = 300;

$(".btn-generate").on("click", (event)=>{
    GenerateImage();
})

let canGenerate = true;

function GenerateImage()
{
    if (!canGenerate)
    {
        return;
    }

    canGenerate = false;

    fetch(`https://picsum.photos/${imgWidth}/${imgHeight}`)
        .then(response => CheckStatus(response))
        .then(imgSrc => SetContainerSrc(imgSrc))
        .catch(error => {
            // Only in development
            // console.error("An Error Occured: ", error.message);
        })
        .finally(()=>{canGenerate = true});
}

function CheckStatus(response)
{
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

function SetContainerSrc(imgSRC)
{
    $("#GeneratedImage-Container").html(`
        <img class="generated-img" src="${imgSRC}">
    `);

    currentSrc = imgSRC;
}

//#endregion

//#region Drop List

function AddToDropLists(newEmail)
{
    AddToShowCollectionDropList(newEmail);
    AddToAddDropList(newEmail);
}

function AddToShowCollectionDropList(newEmail)
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

function AddToAddDropList(newEmail)
{
    let optionsHTML = $("#AddList").html();

    optionsHTML += `
        <option class="option" value="${newEmail}">${newEmail}</option>
        `;

    $("#AddList").html(optionsHTML);
}

$('#DropList').change((event)=>{
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

function ForceSelectItem(email)
{
    document.getElementById('DropList').value=email;
}

//#region Styling Changes when Open

$('select').on("click", (event)=>{
    $(event.target).toggleClass("open");
})

$('select').on("blur", (event)=>{
    $(event.target).removeClass("open");
})

$(document).keyup(function(e) {
    if (e.keyCode == 27) { 
        $('select').removeClass("open");
    }
});

$(window).bind('mousewheel DOMMouseScroll', function (event)
{
    $('select').removeClass("open");
});

//#endregion

//#endregion

//#region Collection

const collection = []; //TODO: Basic collection, need to assign to profiles

function AddToCollection(email)
{
    let emailIndex = GetEmailIndex(email);
    if (emailIndex === false)
    {
        //Email is not in use, add new email then add to collection
        let newUser = {
            user_email: email,
            user_images: []
        }

        newUser.user_images.push(currentSrc);
        collection.push(newUser);

        AddToDropLists(email);
    }
    else if (!collection[emailIndex].user_images.includes(currentSrc))
    {
        //Email is in use, add to array
        collection[emailIndex].user_images.push(currentSrc);
    }
    else
    {
        alert("Image has been added to that email already. \n\nPlease generate a new image or add it to a different email address.");
        return false;
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

function GetEmailFromIndex(index)
{
    if (index > collection.length || index < 0)
    {
        return false;
    }

    return collection[index].user_email;
}

let currentCollection = false;

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

        currentCollection = false;
    }
    else //Runs if email is valid
    {
        imageSrcHTML += GetEmailHTML(emailIndex);
        currentCollection = emailIndex;
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
        <img class="generated-img" src="${collection[index].user_images[i]}">
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

    if (!canGenerate)
    {
        return;
    }

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

    //Text before @
    {
        message: "Please enter some text before the '@' in the email address",
        regexCheck: [/\S+@/],
        required: true
    },

    //Includes @
    {
        message: "Please include an '@' in the email address",
        regexCheck: [/@/],
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

    show = email;
    emailIndex = GetEmailIndex(email);

    //If email address to assign is already being shown, do not need to filter
    if (currentCollection === false && currentCollection !== emailIndex)
    {
        show = "";
    }
    
    ShowCollection(show);

    ForceSelectItem(show);
}

//#endregion

//#region Quick Add To Existing Collection

$(".btn-add").on("click", (event)=>{
    event.preventDefault();

    var email = document.getElementById('AddList').value;

    if (email !== false)
    {
        OnSubmitEmail(email);
    }
})

//#endregion

//#region Smooth Scroll

function SmoothScrollToID(ID)
{
    $('html, body').animate({
        scrollTop: $(`${ID}`).offset().top
    }, 500);
}

//#endregion

