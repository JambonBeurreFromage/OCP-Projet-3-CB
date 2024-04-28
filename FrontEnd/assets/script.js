//////////////////////////////Variables à portée globale//////////////////////////////
//Selection des modales
let modal1 = document.getElementById("modal1");
let modal2 = document.getElementById("modal2");

//Selecteurs et variables login page
let modalProjects = document.querySelector(".modalProjects");
let loginForm = document.querySelector(".loginForm");
let userLog;
let modalEventListeners = [];


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
        let img = document.createElement("img");
        modalProjects.appendChild(figure);
        img.src = showAllProjects[i].imageUrl;
        figure.appendChild(img);

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
function stopPropagation(e) {
    e.stopPropagation();
};

function uploadImg() {
    let imgUploadContainer = document.querySelector("#imgUpload button");
    
    imgUploadContainer.addEventListener("click", () => {
        console.log("click")
    });
};

// // Fonction pour supprimer tous les écouteurs d'événements associés à une modal spécifique
// function removeModalEventListeners(modal) {
//     modalEventListeners.forEach(listener => {
//         if (listener.modal === modal) {
//             modal.removeEventListener(listener.eventType, listener.callback);
//         }
//     });
//     // Filtre les écouteurs d'événements restants pour supprimer ceux associés à la modal
//     modalEventListeners = modalEventListeners.filter(listener => listener.modal !== modal);
// };

// // Fonction pour ajouter un écouteur d'événement à une modal spécifique
// function addModalEventListener(modal, eventType, callback) {
//     modal.addEventListener(eventType, callback);
//     // Stocke la référence de l'écouteur d'événement ajouté
//     modalEventListeners.push({ modal: modal, eventType: eventType, callback: callback });
// };

// // Fonction pour ajouter les écouteurs d'événements à une modal
// function addEventListeners(modal) {
//     // Permet de fermer la modal au clic n'importe où
//     modal.addEventListener("click", () => {
//         closeModal(modal);
//     });

//     // Permet de stoper la propagation de la foncton closeModal lorsqu'on clic sur la div modalWrapper
//     let modalWrapper = document.querySelectorAll(".modalWrapper");
//     modalWrapper.forEach(modal => {
//         modal.addEventListener('click', stopPropagation);
//     });

//     // Permet de lancer closeModal au clic ou à l'appui sur Enter sur chacun des icônes croix
//     let closeModalBtn = document.querySelectorAll(".closeBtn");
//     closeModalBtn.forEach(btn1 => {
//         addModalEventListener(btn1, "click", () => {
//             closeModal(modal);
//         });

//         addModalEventListener(btn1, "keydown", (event) => {
//             if (event.key === "Enter") {
//                 closeModal(modal);
//             };
//         });
//     });

//     // Permet de changer de modal au clic sur le bouton ajouter ou au clic sur back
//     let changeModalBtn = document.querySelectorAll(".jsChangeBtn")
//     changeModalBtn.forEach(btn2 => {
//         addModalEventListener(btn2, "click", () => {
//             changeModal(modal);
//         });

//         addModalEventListener(btn2, "keydown", (event) => {
//             if (event.key === "Enter") {
//                 changeModal(modal);
//             };
//         });
//     });

//     // Permet de fermer la modal lors de l'utilisation de la touche escape
//     addModalEventListener(window, "keydown", (event) => {
//         if (event.key === "Escape" || event.key === "Esc") {
//             closeModal(modal);
//         };
//     });
// };

//Fonction de fermeture de la modal
function closeModal(e) {
    modalProjects.innerHTML = "";
    if (e.classList === "modalTrue") return;
    e.classList.remove("modalTrue");
    e.classList.add("modalHidden");
    e.setAttribute("aria-hidden", "true");
    e.setAttribute("aria-modal", "false");

    // removeModalEventListeners(e);
};

//Fontion permettant de changer de modal, vérifie la modal en paramètre le ferme et charge l'autre
function changeModal(e) {
    closeModal(e);
    console.log(e)
    if (e === modal1) {
        openModal(modal2);
    } else {
        openModal(modal1);
    };
};

//Fonction d'ouverture de la modal
//Ici "e" correspond à la modal que l'on veut ouvrir et que l'on passe à la fonction closeModal
function openModal(e) {
    //Change la classe pour afficher la modal
    e.classList.add("modalTrue");
    e.classList.remove("modalHidden");
    //Change les attribues pour l'accessibilité
    e.removeAttribute("aria-hidden");
    e.setAttribute("aria-modal", "true");

    //Lance la fonction permettant d'afficher la gallery de modification
    galleryUpdate();

    // //Appel les event listeners
    // removeModalEventListeners(e)
    // addEventListeners(e)

    //Si modal2 est chargée, lancer la fonction d'upload
    if (e === modal2) {
        uploadImg();
    };

    //Permet de fermer la modal au click n'importe où
    e.addEventListener("click", () => {
        closeModal(e);
    });

    //Permet de stoper la propagation de la foncton closeModal lorsqu'on clic sur la div modalWrapper
    let modalWrapper = document.querySelectorAll(".modalWrapper");
    modalWrapper.forEach(modal => {
        modal.addEventListener('click', stopPropagation);
    });

    //Permet de lancer closeModal au click ou à l'appui sur enter sur chacun des icones croix
    let closeModalBtn = document.querySelectorAll(".closeBtn");
    closeModalBtn.forEach(btn1 => {
        btn1.addEventListener("click", () => {
            closeModal(e);
        });
    });

    closeModalBtn.forEach(btn1 => {
        btn1.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                closeModal(e);
            };
        });
    });

    //Permet de changer de modal au click sur le bouton ajouter ou au click sur back
    let changeModalBtn = document.querySelectorAll(".jsChangeBtn")
    changeModalBtn.forEach(btn2 => {
        btn2.addEventListener("click", () => {
            changeModal(e);
        });

        btn2.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                changeModal(e);
            };
        });
    });

    //Permet de fermet la modal lors de l'utilisation de la trouche escape
    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" || event.key === "Esc") {
            closeModal(e);
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
        let showSelectProject; //Permet de créer une liste de projet en fonction des filtres choisis
        let spanBtnSelect; //Permet de dissocier les boutons des filtres
        let spanBtn; // Permet de créer les boutons des filtres dans des spans

    
        
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
            spanBtn = document.createElement("span");
            spanBtn.innerText = item;
            spanBtn.classList.add("selectorProject");
            spanBtn.setAttribute("id", item);
            spanBtn.setAttribute("tabindex", indexFilterSet)  // Permet de rendre l'élément selectionnable avec tab
            selectorMenu.appendChild(spanBtn);
            indexFilterSet++; //Change l'index pour la tabulation à chaque boucle
        };
    
        //Atribuer le HTML créé au dessus à la variable spanBtnSelect
        spanBtnSelect = document.querySelectorAll(".selectorProject");
        
        //Ajoute la class pour appliquer le CSS indicant la selection, "tous" étant l'affichage par defaut au chargement
        spanBtnSelect[0].classList.add("selectorProjectSelect");
        
        //Ajouter un événement au click sur chacun des éléments de spanBtnSelect créés dynamiquement
        for (let i = 0; i < filterSet.size; i++) {
            //Pour gerer la selection du bouton au click
            spanBtnSelect[i].addEventListener("click", () => {
                //Filtre la liste complète en ne prenant que les id 
                showSelectProject = showAllProjects.filter((project) => project.categoryId === i);
                
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