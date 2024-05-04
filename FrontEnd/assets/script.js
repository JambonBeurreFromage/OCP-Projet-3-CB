//////////////////////////////Variables à portée globale//////////////////////////////
//Selection des modales
let modal = null;
let modal1 = document.getElementById("modal1");
let modal2 = document.getElementById("modal2");
// let key = null;

//Selecteurs et variables login page
let modalProjects = document.querySelector(".modalProjects");
let loginForm = document.querySelector(".loginForm");
let userLog;


//////////////////////////////Fonctions divers //////////////////////////////
//Fonction d'affichage du message d'erreur dans la zone de login
function messageErreur(error) {
    console.warn(error)
    let messageErrorDiv = document.querySelector(".messageError");

    //Supprime le message d'erreur précédent en cas de nouvelle tentative échouée
    if (messageErrorDiv) {
        messageErrorDiv.remove();
    }
    //affiche le message d'erreur sur la page de connexion
    let messageError = document.createElement("span");
    messageError.setAttribute("class", "messageError")
    messageError.innerHTML = error
    loginForm.appendChild(messageError)
};

function messageErreurModal(error) {
    //Réinitialise la zone de message d'alerte
    document.getElementById("divUplaodAlert").innerHTML = "";

    //affiche le message de confirmation ou d'erreur sur la page d'ajout des travaux
    let messageShow = document.createElement("span");

    if (error === "Travaux ajoutés avec succès") { messageShow.setAttribute("id", "messageSucces") }
    else { messageShow.setAttribute("class", "messageError"); };

    messageShow.innerHTML = error
    document.getElementById("divUplaodAlert").appendChild(messageShow)
};

//Fontion de création des fiches projets // parramètre : projets à afficher
function createHTML(projects) {
    let gallery = document.querySelector(".gallery");
    //Initialise la gallery avec un HTML vierge à chaque appel de fonction
    gallery.innerHTML = "";
    
    //Créer les éléments HTML en fonction du paramètre "projects"
    for (let i = 0; i < projects.length; i++) {
        let figure = document.createElement("figure");
        gallery.appendChild(figure);
        
        let img = document.createElement("img");
        img.src = projects[i].imageUrl;
        figure.appendChild(img);
        
        let caption = document.createElement("figcaption");
        caption.innerText = projects[i].title;
        figure.appendChild(caption);
    };
};

//////////////////////////////Fonctions pour la fenêtre Modal//////////////////////////////
//Functoion d'affichage de la gallery dans la fenêtre de modification
async function galleryUpdate() {
    const allProjects = await fetch("http://localhost:5678/api/works/");
    const showAllProjects = await allProjects.json();
    const localToken = localStorage.getItem("token");

    let trashBtn; // Bouton poubelle pour la modification de la liste projet
    //Creer pour chaque élément la mignature avec le bouton de supression
    //Initialise la gallery avec un HTML vierge à chaque appel de fonction
    modalProjects.innerHTML = "";

    for (let i = 0; i < showAllProjects.length; i++) {

        //Créer les éléments dans lesquels mettre les mignatures
        let figure = document.createElement("figure");

        //Créer les boutons de supression des travaux
        trashBtn = document.createElement("span");
        trashBtn.classList.add("trashBtn")
        trashBtn.innerHTML = "<span class=\"fa-solid fa-trash-can\"></span>"
        trashBtn.setAttribute("tabindex", "3") // Permet de rendre l'élément selectionnable avec tab
        figure.appendChild(trashBtn);

        
        //Créer les mignatures
        let imgUpdate = document.createElement("img");
        modalProjects.appendChild(figure);
        imgUpdate.classList.add("imgGalleryUpdate");
        imgUpdate.src = showAllProjects[i].imageUrl;
        figure.appendChild(imgUpdate);

        //Supprime les travaux aux clics
        trashBtn.addEventListener("click", async () => {

            console.warn("Elément supprimé")

            // Envoyer une requête DELETE à l'API pour supprimer l'élément
            await fetch("http://localhost:5678/api/works/" + showAllProjects[i].id, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localToken}`,
                    "Content-Type": "application/json"
                }
            });

            // Supprimer l'élément HTML de la galerie après avoir supprimé l'élément dans l'API
            figure.remove();
            initFilterProjects();
        });
    };
};

//Fonction pour stroper la propagation aux enfants
let stopPropagation = (e) => {
    e.stopPropagation();
};

////// Permet de prévisuliser l'image
let preview = () => {
    // e.files contient un objet FileList
    let imgContainElement = document.querySelectorAll(".jsLoadImgContain");
    let imgContain = document.getElementById("imgUpload")
    let fileImg = document.querySelector("#imgUpload input");
    const [picture] = fileImg.files;

    // picture est un objet File
    if (picture) {
         // Vérifier la taille de l'image
         if (picture.size > 4 * 1024 * 1024) { // 4 Mo en octets
            let message = "Veuillez choisir une image de moins de 4 Mo.";
            console.warn(message)
             //Réinitlise le fichier chargé et la fenêtre d'ajout d'éléments
            fileImg.value = "";
            document.getElementById("category").innerHTML = "<option></option>";
            closeModal;
            openModal(modal2);
            messageErreurModal(message);
            return;
        };

        //Création de la mignature
        let figure = document.createElement("figure");
        figure.classList.add("jsLoadFigure");
        imgContain.appendChild(figure);
        let imgLoad = document.createElement("img");
        imgLoad.classList.add("jsLoadImg");
        figure.appendChild(imgLoad);
        //Cache la fonctionnalité d'ajout de nouvelle image après le chargement d'une image
        imgContainElement.forEach(element => {
        element.classList.add("jsLoadImgContainHidden");
        });
        // change l'URL de l'image
        imgLoad.src = URL.createObjectURL(picture)
    };    
};

//Change la classe du button d'envoi
let changeClass = (e) => {
    let uplaodBtn = document.querySelector("#idUploadBtn");
    e.preventDefault();

    if (document.querySelector("#imgUpload input").value != ""
        && document.getElementById("title").value != ""
        && document.getElementById("category").value != ""
    ) {
        try{
            uplaodBtn.classList.remove("uploadBtn");
            uplaodBtn.classList.add("uploadBtnReady");
        } catch (error) {
            console.log(error);
        };
    } else {
        try {
            uplaodBtn.classList.add("uploadBtn");
            uplaodBtn.classList.remove("uploadBtnReady");
        } catch (error) {
            console.log(error);
        };
    };
};

let submitFormImg = async (e) => {
    e.preventDefault();

    // Récupérer les données du formulaire
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const fileInput = document.querySelector("#imgUpload input");
    let message;


    const titleRegex = /^[a-zA-Z\s-]*$/;
    if (!titleRegex.test(title)) {
        console.warn("Le titre doit contenir uniquement des lettres, des espaces et le symbole '-'.");
        // Affiche un message d'erreur
        message = "Le titre doit contenir uniquement des lettres, des espaces et le symbole '-'."
        messageErreurModal(message);
        return; // Arrête la fonction si la validation échoue
    }
    

    if (fileInput.value != ""
    && title.value != ""
    && category.value != ""
    ) { 
        //Permet d'attribuer une ID catégorie au objet
        let categoryId;
        if (category === "Objets") { categoryId = "1" }
        else if (category === "Appartements") { categoryId = "2" }
        else if (category === "Hotels & restaurants") { categoryId = "3" };

        // Créer un objet FormData
        const formData = new FormData();
        formData.append("image", fileInput.files[0]);
        formData.append("title", title);
        formData.append("category", categoryId);
    
        // Envoyer une requête POST à l'API pour ajouter l'élément
        try {
            const localToken = localStorage.getItem("token");

            const response = await fetch("http://localhost:5678/api/works/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localToken}`
                },
                body: formData,
            });
            
            // Vérifier si la requête a réussi
            if (response.ok) {
                console.log("Image ajoutée avec succès !");
                //Recharge la liste de travaux de la page principale
                initFilterProjects();

                //Réinitialise le formulaire pour rajouter d'autres travaux
                let imgLoadContent = document.querySelector("#imgUpload figure")
                //en lève l'image
                if (imgLoadContent != null) {
                    closeModal();
                    openModal(modal2);
                };
                //vide le formulaire
                document.getElementById("category").innerHTML = "<option></option>";
                document.getElementById("title").value = "";

                //réaffiche le bouton pour prendre un nouveau projet
                 document.querySelectorAll(".jsLoadImgContain").forEach(element => {
                    element.classList.remove("jsLoadImgContainHidden");
                 });

                //Réinitialise la zone de message d'alerte
                message = "Travaux ajoutés avec succès";
                messageErreurModal(message);
            } else {
                console.error("Erreur lors de l'ajout de l'image :", response.statusText);

                //affiche le message d'erreur sur la page d'ajout des travaux
                message = `Erreur lors de l'ajout de l'image : ${response.statusText}`
                messageErreurModal(message);
            }
        } catch (error) {
            console.error("Erreur lors de la requête POST :", error);
        }
    }
    else {
        console.warn("Merci de compléter le formulaire correctement")

        //Enleve le message précédent si besoin
        document.getElementById("divUplaodAlert").innerHTML = "";
        //affiche le message d'erreur sur la page de connexion
        let messageError = document.createElement("span");
        messageError.setAttribute("class", "messageError");
        messageError.innerHTML = "Merci de compléter le formulaire correctement";
        document.getElementById("divUplaodAlert").appendChild(messageError);
    };
};

async function uploadImg() {
    
    //Listeners sur le changement d'état des l'input d'ajout des images
    document.querySelector("#imgUpload input").addEventListener("change", preview);
    document.querySelector("#imgUpload input").addEventListener("change", changeClass);
    document.querySelector("#title").addEventListener("change", changeClass)
    document.querySelector("#category").addEventListener("change", changeClass)

    //Ajoute la liste de catégories au formulaire
    const allProjects = await fetch("http://localhost:5678/api/works/");
    const showAllProjects = await allProjects.json();
    const filterSetCatergory = new Set();
    let selectCategory = document.getElementById("category");
    
    for (let i = 0; i < showAllProjects.length; i++) {
        filterSetCatergory.add(showAllProjects[i].category.name);
    };
    
    //Création du HTML pour chaque item du Set
    for (let item of filterSetCatergory) {
        let option = document.createElement("option");
        option.innerText = item;
        selectCategory.appendChild(option);
    };

    //Vérifie que les champs du formulaire sont complété pour passer le bouton en validation 
    let uplaodImgBtn = document.querySelector("#idUploadBtn");

    //Ajout de listener et validation du formulaire
    uplaodImgBtn.addEventListener("click", submitFormImg);
};

//Fonction de fermeture de la modal
let closeModal = () => {
    
    //Change les propriété HTML de la fenêtre modale
    // if (modal.classList === "modalTrue") return;
    modal.classList.remove("modalTrue");
    modal.classList.add("modalHidden");
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("aria-modal", "false");


    modal.removeEventListener("click", closeModal);

    if (modal === modal2) {
        try {
            //Supprime les projets éventuellement laissés sans validation dans la modal2
            let imgLoadContent = document.querySelector("#imgUpload figure")

            if (imgLoadContent != null) {
                document.querySelector("#imgUpload input").value = "";
                imgLoadContent.innerHTML = ""
                document.getElementById("imgUpload").removeChild(document.querySelector("#imgUpload figure"));
            };

            //Assure que le formulaire se vide à la fermeture
            document.getElementById("category").innerHTML = "<option></option>";
            document.getElementById("title").value = ""
            
            //Supprime le message d'érreur dans la modal 2
            let errorMessage = document.getElementById("divUplaodAlert");
            errorMessage.innerHTML = "";

            //Supprime les listener de la modal2
            document.querySelector("#imgUpload input").removeEventListener("change", addImgView);
            document.querySelector("#imgUpload input").removeEventListener("change", changeClass);
            document.querySelector("#title").removeEventListener("change", changeClass)
            document.querySelector("#category").removeEventListener("change", changeClass)
            document.querySelector("#idUploadBtn").removeEventListener("click", submitFormImg);
            document.querySelector("#idUploadBtn").classList.remove("uploadBtnReady");
            document.getElementById("closeBtn2").removeEventListener("click", closeModal);
            document.getElementById("wrapper2").removeEventListener('click', stopPropagation);
            document.querySelector(".backBtn").removeEventListener("click", changeModal);
        } catch (error) {
            console.log(error);
        };
    
    } else {
        try {
            //Assure de vider les mignature de la modal à la fermeture
            modalProjects.innerHTML = "";
            //Supprime les listener de la modal1
            document.getElementById("closeBtn1").removeEventListener("click", closeModal);
            document.getElementById("wrapper1").removeEventListener('click', stopPropagation);
            document.querySelector(".changeBtn").removeEventListener("click", changeModal);
        } catch (error) {
            console.log(error);
        }
    };
};

//Fontion permettant de changer de modal, vérifie la modal chargée la ferme et charge l'autre
let changeModal = () => {
    closeModal();
    if (modal === modal1) {
        openModal(modal2);
    } else {
        openModal(modal1);
    };
};

//Fonction d'ouverture de la modal
//Ici "e" correspond à la modal que l'on veut ouvrir et que l'on passe à la fonction closeModal
function openModal(e) {
    if (e === modal1) {
        modal = modal1;
    } else {
        modal = modal2;
        //Si modal2 est chargée, lancer la fonction d'upload
        uploadImg(); 
        //S'assurer que les éléments de imgContain ne soient pas caché.
        document.querySelectorAll(".jsLoadImgContain").forEach(element => {
            element.classList.remove("jsLoadImgContainHidden");
        });
    };

    //Change la classe pour afficher la modal
    modal.classList.add("modalTrue");
    modal.classList.remove("modalHidden");
    //Change les attribues pour l'accessibilité
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");

    //Lance la fonction permettant d'afficher la gallery de modification
    galleryUpdate();

    ////////////////////EventListeners////////////////////
    //Permet de fermer la modal au click n'importe où
    modal.addEventListener("click", closeModal);

    //Permet de stoper la propagation de la foncton closeModal lorsqu'on clic sur la div modalWrapper
    let modalWrapper = document.querySelectorAll(".modalWrapper");
    modalWrapper.forEach(modalWindow => {
        modalWindow.addEventListener('click', stopPropagation);
    });

    //Permet de lancer closeModal au click ou à l'appui sur enter sur chacun des icones croix
    let closeModalBtn = document.querySelectorAll(".closeBtn");
    closeModalBtn.forEach(btn1 => {
        btn1.addEventListener("click", closeModal);
    });


    //Permet de changer de modal au click sur le bouton ajouter ou au click sur back
    let changeModalBtn = document.querySelectorAll(".jsChangeBtn")
    changeModalBtn.forEach(btn2 => {
        btn2.addEventListener("click", changeModal);
    });

    //Permet de fermer la modal lors de l'utilisation de la trouche escape
    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" || event.key === "Esc") {
            closeModal;
        };
    });
};

//////////////////////////////Fonctions pour le login et les droits d'admins//////////////////////////////
//Fonction de gestion des outils admin sur la main page
function admin() {
    let loginBtn = document.getElementById("loginBtn");
    let logoutBtn = document.getElementById("logoutBtn");
    let bandeauAdmin = document.getElementById("bandeauAdmin");
    let modifBtn = document.getElementById("modifBtn");
    let portfolio = document.getElementById("portFolioTitle");
    let header = document.querySelector("body");

    // Affiche le bouton logout lorsque l'utilisateur est identifié (masque le bouton login)
    loginBtn.classList.add("logStatut");
    loginBtn.setAttribute("aria-hidden", "true");
    logoutBtn.classList.remove("logStatut");
    logoutBtn.setAttribute("aria-hidden", "false");

    // Assure qu'aucun élément du bandeau n'est chargé
    if (!bandeauAdmin) {
        // Si bandeauAdmin n'existe pas, le crée
        bandeauAdmin = document.createElement("div");
        bandeauAdmin.setAttribute("id", "bandeauAdmin");
        bandeauAdmin.innerHTML = "<span class=\"fa-solid fa-pen-to-square\"></span><span>Mode édition</span>";
        let parentBandeauHeader = header.parentNode;
        parentBandeauHeader.insertBefore(bandeauAdmin, header);
    };

    // Assure que modifBtn n'existe pas
    if (!modifBtn) {
        // Si modifBtn n'existe pas, le crée
        modifBtn = document.createElement("div");
        modifBtn.setAttribute("id", "modifBtn");
        modifBtn.setAttribute("tabindex", "2");
        modifBtn.innerHTML = "<span class=\"fa-solid fa-pen-to-square\"></span><span> Modifier</span>";
        portfolio.appendChild(modifBtn);

        // Affiche la modal au click ou lors de l'appui sur Enter et lance la fonction de la modification de la galerie
        modifBtn.addEventListener("click", () => {
            openModal(modal1);
        });

        modifBtn.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                openModal(modal1);
            };
        });
    };

};
//Fonction qui vérifie que l'utilisateur est bien autentifié
function userAuth() {
    // Récupération du token depuis l'URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const tokenURL = urlParams.get('token');

    // Récupération du token local
    const localToken = localStorage.getItem("token");

        if (localToken === tokenURL) {
            admin()
        } else {
            let errorToken = "Pas de token valide"
            messageErreur(errorToken)
        }
}

//Fonction d'autentification de l'utilisateur
function login() {

    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let userToken; 

    try{
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            // Récupération des éléments d'autentifications de l'utilisateur
            const user = {
                email: email.value,
                password: password.value,
            };
    
            //Création de la charge utile
            const chargeUser = JSON.stringify(user)
       
            fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: chargeUser,
            }).then(function (res) {
                if (res.ok === true) {
                    return res.json().then(function(data) {
                        userToken = data.token; // Récupère le token depuis les données
                        localStorage.setItem('token', userToken); // Stock le token en local pour vérif sur la main page
                        // Redirection vers la page principale en incluant le token comme paramètre d'URL
                        window.location.href = "index.html?token=" + userToken;
                    });
                } else {
                    let errorID = "Erreur dans l’identifiant ou le mot de passe"
                    messageErreur(errorID)
                };
            });
        });
    
    
    } catch (erreur) {
        console.log(erreur)
    }
};

//////////////////////////////Fonctions pour l'affichages du site de base//////////////////////////////
// Récupération de les projets sur l'API, les affiches et créer les filtres
async function initFilterProjects () {
try {
        const allProjects = await fetch("http://localhost:5678/api/works/");
        const showAllProjects = await allProjects.json();
    
        let selectorMenu = document.querySelector(".selectorMenu");
        selectorMenu.innerHTML = "";

        //Création de la liste des boutons, récupération des élément dans allProjects.json "category.name"
        //le "Set" permet d'éviter les doublons
        const filterSet = new Set();
        let indexFilterSet = 6;
        
        filterSet.add("Tous") // Ajoute la valeurs "tous" non présente dans les valeurs allProjects.json "category.name"
        //Récupére les valeurs name de category dans showAllProject et les ajoute a filterSet
        for (let i = 0; i < showAllProjects.length; i++) {
            filterSet.add(showAllProjects[i].category.name);
        };
        
        //Création du HTML pour chaque item du Set
        for (let item of filterSet) {
            let spanBtn = document.createElement("span");
            spanBtn.innerText = item;
            spanBtn.classList.add("selectorProject");
            spanBtn.setAttribute("id", item);
            spanBtn.setAttribute("tabindex", indexFilterSet)  // Permet de rendre l'élément selectionnable avec tab
            selectorMenu.appendChild(spanBtn);
            indexFilterSet++; //Change l'index pour la tabulation à chaque boucle
        };
    
        //Atribuer le HTML créé au dessus à la variable spanBtnSelect
        let spanBtnSelect = document.querySelectorAll(".selectorProject");
        
        //Ajoute la class pour appliquer le CSS indicant la selection, "tous" étant l'affichage par defaut au chargement
        spanBtnSelect[0].classList.add("selectorProjectSelect");
        
        //Ajouter un événement au click sur chacun des éléments de spanBtnSelect créés dynamiquement
        for (let i = 0; i < filterSet.size; i++) {
            //Pour gerer la selection du bouton au click
            spanBtnSelect[i].addEventListener("click", () => {
                //Filtre la liste complète en ne prenant que les id 
                let showSelectProject = showAllProjects.filter((project) => project.categoryId === i);
                
                //Enlève la classe "selectorProjectSelect" à tous les boutons avant de l'attribuer au bonton cliqué
                spanBtnSelect.forEach(element => {
                    element.classList.remove("selectorProjectSelect");
                });
                spanBtnSelect[i].classList.add("selectorProjectSelect");
                
                //Appel la foction de création de la liste de projets HTML avec en argument la liste triée
                createHTML(showSelectProject);
            });

            //Pour gerer la selection du bouton à l'appui ur Entrer
            spanBtnSelect[i].addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    //Filtre la liste complète en ne prenant que les id
                    showSelectProject = showAllProjects.filter((project) => project.categoryId === i);
                    
                    //Enlève la classe "selectorProjectSelect" à tous les boutons avant de l'attribuer au bonton cliqué
                    spanBtnSelect.forEach(element => {
                        element.classList.remove("selectorProjectSelect");
                    });
                    spanBtnSelect[i].classList.add("selectorProjectSelect");
                    
                    //Appel la foction de création de la liste de projets HTML avec en argument la liste triée
                    createHTML(showSelectProject);
                };
            });
        };
        
        //Ajouter un événement au click sur le bouton "Tous"
        spanBtnSelect[0].addEventListener("click", () => {
            createHTML(showAllProjects);
        });
    
        spanBtnSelect[0].addEventListener("keydown", (event) => {
        if (event.key === "Enter") { createHTML(showAllProjects); };
        });

    //Affiche tous les projets au premier appel de la fonction initFilterProjects
    createHTML(showAllProjects);
    userAuth();
    
} catch (error) {
    console.log(error);
}
};

initFilterProjects();
login();