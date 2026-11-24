let form = document.querySelector("form");
let addUser = document.querySelector("#add-user");

function cancelForm(){
    document.querySelector(".container").style.display = "flex";
    document.querySelector(".form-container").style.display = "none";

    document.querySelector(".edit-form-container").style.display = "none";

}

addUser.addEventListener("click", ()=> {
    document.querySelector(".container").style.display = "none";
    document.querySelector(".form-container").style.display = "initial";
})

form.addEventListener("submit", function(evt){
    evt.preventDefault();

    let imageURL = document.querySelector("#imageURL").value.trim();
    let fullName = document.querySelector("#userName").value.trim();
    let userId = document.querySelector("#userId").value.trim();
    let userRole = document.querySelector('input[name="role"]:checked').value.trim();
    let emailId = document.querySelector("#userEmail").value.trim();
    
    let errors = [];

    if (!imageURL)
    {
        errors.push("Image URL is required.");
        alert("Image URL is required.")
    }

    const nameRegex = /^[a-zA-ZÀ-ÿ]{1,}(?:[ '-][a-zA-ZÀ-ÿ]{1,})+\s*$/;
    if (!fullName)
    {
        errors.push("Full name is required.");
        alert("Full name is required.")
        return;
    }
    else if (!nameRegex.test(fullName))
    {
        errors.push("Please enter a valid full name.");
        alert("Please enter a valid full name.");
        return;
    }

    const userIdRegex = /^[A-Z0-9]{8,15}$/;
    if(!userId){
        errors.push("User ID is required.");
        alert("User ID is required.")
        return;
    }
    else if(!userIdRegex.test(userId)){
        errors.push("Please enter a valid User ID.");
        alert("Please enter a valid User ID.");
        return;
    }   

    if (!userRole)
    {
        errors.push("Profession is required.");
        alert("Profession is required.");
        return;
    }

    const emailPattern =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailId)
    {
        errors.push("Email is required.");
        alert("Email is required");
        return;
    }
    else if (!emailPattern.test(emailId))
    {
        errors.push("Please enter a valid email address.");
        alert("Please enter a valid email address.");
        return;
    }

    if (errors.length > 0)
    {
        console.error("Validation Failed:", errors);
        alert(errors.join("\n"));
        return;
    } 
    else{
        // alert("Validation Successful! Data ready to submit.");
        try{
            // console.log({imageURL,fullName,userRole,emailId});
            
            saveProfileToLocalStorage({imageURL, fullName, userId, userRole, emailId});
            form.reset();
            cancelForm();

        }
        catch(error){
            alert(error);
        }
        finally{
            showCards();
        }
    }
})

function saveProfileToLocalStorage(obj){

    if(!localStorage.getItem("profiles")){
        let profiles = [];
        profiles.push(obj)
        localStorage.setItem("profiles",JSON.stringify(profiles));

    }
    else{
        let profiles = JSON.parse(localStorage.getItem("profiles"));
        profiles.push(obj);
        localStorage.setItem("profiles", JSON.stringify(profiles));
    }

    showCards();
    
    // Reloads the current page using the browser cache
    window.location.reload();

}

function showCards(){

    let profiles = JSON.parse(localStorage.getItem("profiles"));
    
    const stack = document.querySelector(".stack");

    if(profiles.length == 0){
                
        stack.style.display = "none";
        document.querySelector(".no-data-found").style.display = "initial";
        if( window.confirm("NO DATA FOUND. INSERT DATA?")){
            document.querySelector(".container").style.display = "none";
            document.querySelector(".form-container").style.display = "initial";   
        } 
    }
    else{

        stack.style.display = "initial";

        profiles.forEach(profileData => {

        // Outer Card Wrapper
        const card = document.createElement("div");
        card.classList.add("card");

        // --- 1. Image & Name Container ---
        const imgNameDiv = document.createElement("div");
        imgNameDiv.classList.add("img-name");

        const img = document.createElement("img");
        img.src = profileData.imageURL;
        img.alt = "Profile Picture";

        const namePara = document.createElement("p");
        namePara.textContent = profileData.fullName;

        imgNameDiv.appendChild(img);
        imgNameDiv.appendChild(namePara);
        card.appendChild(imgNameDiv);

        // --- 2. Registration Number Section ---
        const userIdDiv = document.createElement("div");
        userIdDiv.classList.add("reg-no");

        const idLabel = document.createElement("p");
        idLabel.textContent = "Register Number :";
        const idVal = document.createElement("p");
        idVal.textContent = profileData.userId;

        userIdDiv.appendChild(idLabel);
        userIdDiv.appendChild(idVal);
        card.appendChild(userIdDiv);

        // --- 3. Role/Profession Section ---
        const roleDiv = document.createElement("div");
        roleDiv.classList.add("role");

        const roleLabel = document.createElement("p");
        roleLabel.textContent = "Role :";
        const roleVal = document.createElement("p");
        roleVal.textContent = profileData.userRole;

        roleDiv.appendChild(roleLabel);
        roleDiv.appendChild(roleVal);
        card.appendChild(roleDiv);

        // --- 4. Email Section ---
        const emailDiv = document.createElement("div");
        emailDiv.classList.add("email");

        const emailLabel = document.createElement("p");
        emailLabel.textContent = "Email :";
        const emailVal = document.createElement("p");
        emailVal.textContent = profileData.emailId;

        emailDiv.appendChild(emailLabel);
        emailDiv.appendChild(emailVal);
        card.appendChild(emailDiv);

        // --- 5. Operations Panel (Buttons) ---
        const operationsDiv = document.createElement("div");
        operationsDiv.classList.add("operations");

        const printBtn = document.createElement("p");
        printBtn.textContent = "Print";
        printBtn.setAttribute("id", "print-profile");
        printBtn.setAttribute('onclick', 'saveCard()');

        const editBtn = document.createElement("p");
        editBtn.textContent = "Edit";
        editBtn.setAttribute("id", "edit-profile");
        editBtn.setAttribute('onclick', 'editCard()');

        const deleteBtn = document.createElement("p");
        deleteBtn.textContent = "Delete";
        deleteBtn.setAttribute("id", "delete-profile");
        deleteBtn.setAttribute('onclick', 'deleteCard()');

        operationsDiv.appendChild(printBtn);
        operationsDiv.appendChild(editBtn);
        operationsDiv.appendChild(deleteBtn);
        card.appendChild(operationsDiv);

        // Final Assembly step
        if(stack){
            stack.append(card);
        }
        });
    }
}

showCards();

const stack = document.querySelector(".stack");

document.querySelector("#up-icon").addEventListener("click", function(){
        
    let firstCard = stack.firstElementChild;

    if(firstCard){
        stack.append(firstCard);
    }
    else{
        document.querySelector(".stack").style.display = "none";
        document.querySelector(".no-data-found").style.display = "initial";
        if( window.confirm("NO DATA FOUND. INSERT DATA?")){
            document.querySelector(".container").style.display = "none";
            document.querySelector(".form-container").style.display = "initial";   
        }    
    }

});

document.querySelector("#down-icon").addEventListener("click", function(){

    let lastCard = stack.lastElementChild;
    if(lastCard){
        stack.prepend(lastCard);
    }
    else{
        document.querySelector(".stack").style.display = "none";
        document.querySelector(".no-data-found").style.display = "initial";
        if( window.confirm("NO DATA FOUND. INSERT DATA?")){
            document.querySelector(".container").style.display = "none";
            document.querySelector(".form-container").style.display = "initial";   
        }
        
    }
    
    
});

function saveCard(){

    let actions = document.querySelector(".actions");
    actions.style.display = "none";

    let operations = document.querySelector(".operations");
    operations.style.display = "none";

    let firstCard = stack.firstElementChild;
    firstCard.style.transform = "scale(1.8)";

    window.print();
    firstCard.style.transform = "";
    operations.style.display = "initial";

    actions.style.display = "initial";
    window.location.reload();
    
}

function editCard(){

    let profileData = (JSON.parse(localStorage.getItem("profiles")));

    let firstCard = document.querySelector(".stack").firstElementChild;
    let editId = firstCard.firstChild.nextSibling.lastElementChild.textContent;
    // console.log(editId);

    document.querySelector(".container").style.display = "none";
    document.querySelector(".edit-form-container").style.display = "initial";
    
    let userIdIndex = profileData.findIndex(data => data.userId == editId)
    // console.log(userIdIndex);
    // console.log(profileData[userIdIndex]);
    
    let imageURL = document.querySelector(".edit-form-container #imageURL").value = profileData[userIdIndex].imageURL;
    let fullName = document.querySelector(".edit-form-container #userName").value = profileData[userIdIndex].fullName;
    
    let userId = document.querySelector(".edit-form-container #userId");
    userId.value = profileData[userIdIndex].userId;
    userId.readOnly = true;

    let role = profileData[userIdIndex].userRole;    
    let userRole = document.querySelector(`.edit-form-container input[value="${role}"]`);
    userRole ? userRole.checked = true : null;

    let emailId = document.querySelector(".edit-form-container #userEmail").value = profileData[userIdIndex].emailId;
}

document.querySelector(".edit-form-container form").addEventListener("submit", (evt)=> {

    evt.preventDefault();

    let imageURL = document.querySelector(".edit-form-container #imageURL").value.trim();
    let fullName = document.querySelector(".edit-form-container #userName").value.trim();
    let userId = document.querySelector(".edit-form-container #userId").value.trim();
    let userRole = document.querySelector('.edit-form-container input[name="role"]:checked').value.trim();
    let emailId = document.querySelector(".edit-form-container #userEmail").value.trim();
    
    let errors = [];

    if (!imageURL)
    {
        errors.push("Image URL is required.");
        alert("Image URL is required.")
    }

    const nameRegex = /^[a-zA-ZÀ-ÿ]{1,}(?:[ '-][a-zA-ZÀ-ÿ]{1,})+\s*$/;
    if (!fullName)
    {
        errors.push("Full name is required.");
        alert("Full name is required.")
        return;
    }
    else if (!nameRegex.test(fullName))
    {
        errors.push("Please enter a valid full name.");
        alert("Please enter a valid full name.");
        return;
    }

    const userIdRegex = /^[A-Z0-9]{8,15}$/;
    if(!userId){
        errors.push("User ID is required.");
        alert("User ID is required.")
        return;
    }
    else if(!userIdRegex.test(userId)){
        errors.push("Please enter a valid User ID.");
        alert("Please enter a valid User ID.");
        return;
    }   

    if (!userRole)
    {
        errors.push("Profession is required.");
        alert("Profession is required.");
        return;
    }

    const emailPattern =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailId)
    {
        errors.push("Email is required.");
        alert("Email is required");
        return;
    }
    else if (!emailPattern.test(emailId))
    {
        errors.push("Please enter a valid email address.");
        alert("Please enter a valid email address.");
        return;
    }

    if (errors.length > 0)
    {
        console.error("Validation Failed:", errors);
        alert(errors.join("\n"));
        return;
    } 
    else{

        try{
            
            let profileData = (JSON.parse(localStorage.getItem("profiles")));
            let userIdIndex = profileData.findIndex(data => data.userId == userId);
            profileData[userIdIndex] = ({imageURL, fullName, userId, userRole, emailId});

            localStorage.setItem("profiles",JSON.stringify(profileData));
            document.querySelector(".edit-form-container form").reset();
            cancelForm();
        }
        catch(error){
            alert(error);
        }
        finally{
            window.location.reload();
            showCards();
        }
    }
})


function deleteCard(){

    let profileData = (JSON.parse(localStorage.getItem("profiles")));

    let firstCard = document.querySelector(".stack").firstElementChild;
    let editId = firstCard.firstChild.nextSibling.lastElementChild.textContent;
    console.log(editId);
    let userIdIndex = profileData.findIndex(data => data.userId == editId)
    console.log(userIdIndex);
    profileData.splice(userIdIndex, 1);
    localStorage.setItem("profiles",JSON.stringify(profileData));

    showCards();
    window.location.reload();
}

/* const form = document.querySelector('form');
const addUser = document.querySelector('#add-user');
const editFormContainer = document.querySelector('.edit-form-container');
const editForm = editFormContainer.querySelector('form');
const stack = document.querySelector('.stack');
const noDataFound = document.querySelector('.no-data-found');

// Centralized CSS Display State Controller
function cancelForm() {
    document.querySelector('.container').style.display = 'flex';
    document.querySelector('.form-container').style.display = 'none';
    editFormContainer.style.display = 'none';
}

addUser.addEventListener('click', () => {
    document.querySelector('.container').style.display = 'none';
    document.querySelector('.form-container').style.display = 'initial';
});

// Centralized Validation Helper Strategy
function validateProfile(data) {
    const errors = [];
    const nameRegex = /^[a-zA-ZÀ-ÿ]{1,}(?:[ -][a-zA-ZÀ-ÿ]{1,})+\s*$/;
    const userIdRegex = /^[A-Z0-9]{8,15}$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!data.imageURL) errors.push("Image URL is required.");
    if (!data.fullName) errors.push("Full name is required.");
    else if (!nameRegex.test(data.fullName)) errors.push("Please enter a valid full name.");
    
    if (!data.userId) errors.push("User ID is required.");
    else if (!userIdRegex.test(data.userId)) errors.push("Please enter a valid User ID.");
    
    if (!data.userRole) errors.push("Profession is required.");
    if (!data.emailId) errors.push("Email is required.");
    else if (!emailPattern.test(data.emailId)) errors.push("Please enter a valid email address.");

    if (errors.length > 0) {
        alert(errors.join('\n'));
        return false;
    }
    return true;
}

// Form Submit: Create Profile
form.addEventListener('submit', function(evt) {
    evt.preventDefault();
    const profileData = {
        imageURL: document.querySelector('#imageURL').value.trim(),
        fullName: document.querySelector('#userName').value.trim(),
        userId: document.querySelector('#userId').value.trim(),
        userRole: document.querySelector('input[name=role]:checked')?.value?.trim() || "",
        emailId: document.querySelector('#userEmail').value.trim()
    };

    if (!validateProfile(profileData)) return;

    saveProfileToLocalStorage(profileData);
    form.reset();
    cancelForm();
});

function getProfiles() {
    return JSON.parse(localStorage.getItem('profiles')) || [];
}

function saveProfileToLocalStorage(obj) {
    const profiles = getProfiles();
    profiles.push(obj);
    localStorage.setItem('profiles', JSON.stringify(profiles));
    showCards();
}

// Render Engine: Clean, Modern, Component Architecture
function showCards() {
    if (!stack) return;
    stack.innerHTML = ""; // Clear existing elements to avoid duplicates instead of page reloads
    
    const profiles = getProfiles();

    if (profiles.length === 0) {
        stack.style.display = 'none';
        noDataFound.style.display = 'initial';
        return;
    }

    stack.style.display = 'initial';
    noDataFound.style.display = 'none';

    profiles.forEach(profileData => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.userId = profileData.userId; // Secure data binding

        // 1. Image & Name
        const imgNameDiv = document.createElement('div');
        imgNameDiv.classList.add('img-name');
        const img = document.createElement('img');
        img.src = profileData.imageURL;
        img.alt = 'Profile Picture';
        const namePara = document.createElement('p');
        namePara.textContent = profileData.fullName;
        imgNameDiv.append(img, namePara);

        // 2. Registration Section
        const userIdDiv = document.createElement('div');
        userIdDiv.classList.add('reg-no');
        userIdDiv.innerHTML = `<p>Register Number :</p><p>${profileData.userId}</p>`;

        // 3. Role/Profession Section
        const roleDiv = document.createElement('div');
        roleDiv.classList.add('role');
        roleDiv.innerHTML = `<p>Role :</p><p>${profileData.userRole}</p>`;

        // 4. Email Section
        const emailDiv = document.createElement('div');
        emailDiv.classList.add('email');
        emailDiv.innerHTML = `<p>Email :</p><p>${profileData.emailId}</p>`;

        // 5. Action Panel Operations
        const operationsDiv = document.createElement('div');
        operationsDiv.classList.add('operations');

        const printBtn = document.createElement('p');
        printBtn.classList.add('action-btn');
        printBtn.textContent = 'Print';
        printBtn.addEventListener('click', () => saveCard(card));

        const editBtn = document.createElement('p');
        editBtn.classList.add('action-btn');
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => editCard(profileData.userId));

        const deleteBtn = document.createElement('p');
        deleteBtn.classList.add('action-btn');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteCard(profileData.userId));

        operationsDiv.append(printBtn, editBtn, deleteBtn);
        card.append(imgNameDiv, userIdDiv, roleDiv, emailDiv, operationsDiv);
        stack.append(card);
    });
}

// Stack Traversals (Up / Down controls)
document.querySelector('#up-icon').addEventListener('click', function() {
    let firstCard = stack.firstElementChild;
    if (firstCard) stack.append(firstCard);
});

document.querySelector('#down-icon').addEventListener('click', function() {
    let lastCard = stack.lastElementChild;
    if (lastCard) stack.prepend(lastCard);
});

function saveCard(targetCard) {
    const operations = targetCard.querySelector('.operations');
    if (operations) operations.style.display = 'none';
    
    targetCard.style.transform = 'scale(1.8)';
    window.print();
    
    targetCard.style.transform = '';
    if (operations) operations.style.display = 'initial';
}

function editCard(userId) {
    const profiles = getProfiles();
    const targetProfile = profiles.find(data => data.userId === userId);
    if (!targetProfile) return;

    document.querySelector('.container').style.display = 'none';
    editFormContainer.style.display = 'initial';

    editForm.querySelector('#imageURL').value = targetProfile.imageURL;
    editForm.querySelector('#userName').value = targetProfile.fullName;
    
    const idInput = editForm.querySelector('#userId');
    idInput.value = targetProfile.userId;
    idInput.readOnly = true;

    const userRole = editForm.querySelector(`input[value="${targetProfile.userRole}"]`);
    if (userRole) userRole.checked = true;

    editForm.querySelector('#userEmail').value = targetProfile.emailId;
}

// Form Submit: Update Profile
editForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const updatedData = {
        imageURL: editForm.querySelector('#imageURL').value.trim(),
        fullName: editForm.querySelector('#userName').value.trim(),
        userId: editForm.querySelector('#userId').value.trim(),
        userRole: editForm.querySelector('input[name=role]:checked')?.value?.trim() || "",
        emailId: editForm.querySelector('#userEmail').value.trim()
    };

    if (!validateProfile(updatedData)) return;

    const profiles = getProfiles();
    const index = profiles.findIndex(data => data.userId === updatedData.userId);
    if (index !== -1) {
        profiles[index] = updatedData;
        localStorage.setItem('profiles', JSON.stringify(profiles));
    }

    editForm.reset();
    cancelForm();
    showCards();
});

function deleteCard(userId) {
    let profiles = getProfiles();
    profiles = profiles.filter(data => data.userId !== userId);
    localStorage.setItem('profiles', JSON.stringify(profiles));
    showCards();
}

// Initialize Application Engine on load
showCards();
 */

