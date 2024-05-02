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
    let messageError = document.getElementById("messageError");

    //Supprime le message d'erreur précédent en cas de nouvelle tentative échouée
    if (messageError) {
        messageError.remove();
    }
    //affiche le message d'erreur sur la page de connexion
    messageError = document.createElement("span");
    messageError.setAttribute("id", "messageError")
    messageError.innerHTML = error
    loginForm.appendChild(messageError)
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
            console.log(showAllProjects[i].id)
            console.log(localToken)


            // // Envoyer une requête DELETE à l'API pour supprimer l'élément
            // await fetch("http://localhost:5678/api/works/" + showAllProjects[i].id, {
            //     method: "DELETE",
            //     headers: {
            //         "Authorization": `Bearer ${localToken}`,
            //         "Content-Type": "application/json"
            //     }
            // });

            // Supprimer l'élément HTML de la galerie après avoir supprimé l'élément dans l'API
            figure.remove();
        });

        //Supprime les traux avec la touche entrée
        trashBtn.addEventListener("keydown", async (event) => {
            if (event.key === "Enter") {
                console.log(showAllProjects[i].id)
                console.log(localToken)


                // // Envoyer une requête DELETE à l'API pour supprimer l'élément
                // await fetch("http://localhost:5678/api/works/" + showAllProjects[i].id, {
                //     method: "DELETE",
                //     headers: {
                //         "Authorization": `Bearer ${localToken}`,
                //         "Content-Type": "application/json"
                //     }
                // });

                // Supprimer l'élément HTML de la galerie après avoir supprimé l'élément dans l'API
                figure.remove();
            };
        });
    };
};

//Fonction pour stroper la propagation aux enfants
let stopPropagation = (e) => {
    e.stopPropagation();
};

////// Permet de prévisuliser l'image
let preview = (e) => {
    // e.files contient un objet FileList
    let imgContain = document.getElementById("imgUpload")
    const [picture] = e.files;
    console.log("test2")

    //Création de la mignature
    let figure = document.createElement("figure");
    figure.classList.add("jsLoadFigure");
    imgContain.appendChild(figure);
    let imgLoad = document.createElement("img");
    imgLoad.classList.add("jsLoadImg");
    figure.appendChild(imgLoad);

    // picture est un objet File
    if (picture) {
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
            console.log("click")
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

//Met en forme le conteneur de l'image prévisualisée
let addImgView = () => {
    let fileImg = document.querySelector("#imgUpload input");
    let imgContainElement = document.querySelectorAll(".jsLoadImgContain");

    console.log("test")
    imgContainElement.forEach(element => {
        element.classList.add("jsLoadImgContainHidden");
    });

    preview(fileImg);
};

let submitFormImg = async (e) => {
    e.preventDefault();
    
    //message d'erreur en cas de mauvaise soumission du formualire
    let messageError = document.getElementById("messageError");   
    //Supprime le message d'erreur précédent en cas de nouvelle tentative échouée
    if (messageError) {
        messageError.remove();
    };

    if (document.querySelector("#imgUpload input").value != ""
    && document.getElementById("title").value != ""
    && document.getElementById("category").value != ""
    ) { 
            // Récupérer les données du formulaire
            const title = document.getElementById("title").value;
            const category = document.getElementById("category").value;
            const fileInput = document.querySelector("#imgUpload input");

            // Créer un objet FormData
            const formData = new FormData();
            formData.append("title", title);
            formData.append("category", category);
            formData.append("image", fileInput.files[0]);

            // Envoyer une requête POST à l'API pour ajouter l'élément
            const localToken = localStorage.getItem("token");
            try {
                const response = await fetch("http://localhost:5678/api/works/", {
                    method: "POST",
                    headers:{
                                "Authorization": `Bearer ${localToken}`,
                                "Content-Type": "application/json"
                            },
                    body: formData,
                });
                
                // Vérifier si la requête a réussi
                if (response.ok) {
                    console.log("Image ajoutée avec succès !");
                } else {
                    console.error("Erreur lors de l'ajout de l'image :", response.statusText);
                }
            } catch (error) {
                console.error("Erreur lors de la requête POST :", error);
            }
        }
        // // Récupération de limage
        // let imgCharge = document.querySelector("#imgUpload input")
        // const [pictureLoad] = imgCharge.files;
        // console.log(pictureLoad)

        // //Création de la charge utile
        // const uplaodElement = {
        // image: pictureLoad,
        // title: document.getElementById("title").value,
        // category: document.getElementById("category").value,
        // };
        // console.log(uplaodElement)


        // //Création de la charge utile format JSON
        // const chargeUplaodElement = JSON.stringify(uplaodElement)
        // console.log(chargeUplaodElement)

        // const localToken = localStorage.getItem("token");
        // //Envoyer une requête POST à l'API pour ajouter l'élément
        // await fetch("http://localhost:5678/api/works/", {
        //     method: "POST",
        //     headers:{
        //                 "Authorization": `Bearer ${localToken}`,
        //                 "Content-Type": "application/json"
        //             },
        //     body: chargeUplaodElement,
        // });
    else {
        console.warn("error")

        //affiche le message d'erreur sur la page de connexion
        messageError = document.createElement("span");
        messageError.setAttribute("id", "messageError")
        messageError.innerHTML = "Merci de compléter le formulaire correctement"
        document.getElementById("divUplaodAlert").appendChild(messageError)
    };

    // Supprimer l'élément HTML de la galerie après avoir supprimé l'élément dans l'API
    // figure.remove();
};

async function uploadImg() {
    
    //Listeners sur le changement d'état des l'input d'ajout des images
    document.querySelector("#imgUpload input").addEventListener("change", addImgView);
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

    console.log("close modal")
    modalProjects.innerHTML = "";


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
            let imgLoad = document.querySelector("#imgUpload figure")

            if (imgLoad != null) {
                imgLoad.innerHTML = ""
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
            //Supprime les listener de la modal1
            document.getElementById("closeBtn1").removeEventListener("click", closeModal);
            document.getElementById("wrapper1").removeEventListener('click', stopPropagation);
            document.querySelector(".changeBtn").removeEventListener("click", changeModal);
        } catch (error) {
            console.log(error);
        }
    };

    console.log("close modal finish")
};

//Fontion permettant de changer de modal, vérifie la modal chargée la ferme et charge l'autre
let changeModal = () => {
    console.log("change modal")
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
    console.log("open modal")
    console.log(e)
    if (e === modal1) {
        modal = modal1;
        console.log("modal = modal 1")
    } else {
        modal = modal2;
        console.log("modal = modal 2")
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

    //Affiche le bouton logout lorsque l'utilisateur est identifié (masque le bouton login)
    loginBtn.classList.add("logStatut");
    loginBtn.setAttribute("aria-hidden", "true")
    logoutBtn.classList.remove("logStatut");
    logoutBtn.setAttribute("aria-hidden", "false")

    //Assure qu'aucun élément du bandeau n'est chargé
    if (bandeauAdmin) {
        bandeauAdmin.remove();
    }

    //affiche le bandeau Admin lorque l'utilisateur est logé
    bandeauAdmin = document.createElement("div");
    bandeauAdmin.setAttribute("id", "admin");
    bandeauAdmin.innerHTML = "<span class=\"fa-solid fa-pen-to-square\"></span><span>Mode édition</span>";
    let parentBandeauHeader = header.parentNode;
    parentBandeauHeader.insertBefore(bandeauAdmin, header);

    //affiche le bouton de modification lorque l'utilisateur est logé
    modifBtn = document.createElement("div");
    modifBtn.setAttribute("id", "modifPortfolio");
    modifBtn.setAttribute("tabindex", "2");
    modifBtn.innerHTML = "<span class=\"fa-solid fa-pen-to-square\"></span><span> Modifier</span>";
    portfolio.appendChild(modifBtn);

    //Affiche la modal au click ou lors de l'appui sur Enter et lance la fonction de la modification de la galerie
    modifBtn.addEventListener("click", () => {
        console.log("afficher la fenêtre de modification des projets au click")
        openModal(modal1);
    });

    modifBtn.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            console.log("afficher la fenêtre de modification des projets avec entrée")
            openModal(modal1);;
        };
    });
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
// Récupération de la liste sur l'API
async function initFilterProjects () {
try {
        const allProjects = await fetch("http://localhost:5678/api/works/");
        const showAllProjects = await allProjects.json();
    
        let selectorMenu = document.querySelector(".selectorMenu");

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