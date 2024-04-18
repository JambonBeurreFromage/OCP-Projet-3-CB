//Selecteurs et variables main page
let header = document.querySelector("body");
let loginBtn = document.getElementById("loginBtn");
let logoutBtn = document.getElementById("logoutBtn");
let portfolio = document.getElementById("portFolioTitle");
let modal1 = document.getElementById("modal1");
let modal2 = document.getElementById("modal2");
let modalProjects = document.querySelector(".modalProjects")
let selectorMenu = document.querySelector(".selectorMenu");
let gallery = document.querySelector(".gallery");
let addProjectBtn = document.querySelector(".modalHidden button")
let closeModaleBtn = document.querySelectorAll(".closeBtn")
let backModaleBtn = document.querySelector(".backBtn")
let trashBtn; // Bouton poubelle pour la modification de la liste projet
let spanBtn; // Permet de créer les boutons des filtres dans des spans
let spanBtnSelect; //Permet de dissocier les boutons des filtres
let showSelectProject; //Permet de créer une liste de projet en fonction des filtres choisis


//Selecteurs et variables login page
let email = document.getElementById("email");
let password = document.getElementById("password");
let loginForm = document.querySelector(".loginForm");
let userLog;
let userToken; 


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

//Fonction de gestion de la galerie dans la fenêtre modale (supression et ajout de travaux)
async function galleryUpdate() {
    const allProjects = await fetch("http://localhost:5678/api/works/");
    const showAllProjects = await allProjects.json();

    const localToken = localStorage.getItem("token");

    //Creer pour chaque élément la mignature avec le bouton de supression
    //Initialise la gallery avec un HTML vierge à chaque appel de fonction
    modalProjects.innerHTML = "";

    for (let i = 0; i < showAllProjects.length; i++) {
        let figure = document.createElement("figure");
        modalProjects.appendChild(figure);

        trashBtn = document.createElement("span");
        trashBtn.classList.add("trashBtn")
        trashBtn.innerHTML = "<span class=\"fa-solid fa-trash-can\"></span>"
        trashBtn.setAttribute("tabindex", i+2) // Permet de rendre l'élément selectionnable avec tab
        figure.appendChild(trashBtn);

        trashBtn.addEventListener("click", (index => {
            return async () => {
                console.log(showAllProjects[index].id)
                console.log(localToken)


                // // Envoyer une requête DELETE à l'API pour supprimer l'élément
                // await fetch("http://localhost:5678/api/works/" + showAllProjects[index].id, {
                //     method: "DELETE",
                //     headers: {
                //         "Authorization": `Bearer ${localToken}`,
                //         "Content-Type": "application/json"
                //     }
                // });

                // Supprimer l'élément HTML de la galerie après avoir supprimé l'élément dans l'API
                figure.remove();
            };
        })(i)); // permet de récupérer la variable i du for pour la faire coincider avec la variable index du eventListener
        
        let img = document.createElement("img");
        img.src = showAllProjects[i].imageUrl;
        figure.appendChild(img);
    };

    //Gestion de la fermeture de la fenêtre modale et/ou changement de page
    //fermeture de la modale
    closeModaleBtn.forEach(btn => {
        btn.addEventListener("click", () => {
            modal1.classList.remove("modalTrue");
            modal1.setAttribute("aria-hidden", "true")

            modal2.classList.remove("modalTrue");
            modal2.setAttribute("aria-hidden", "true")
        });
    });

    //Changement de page
    addProjectBtn.addEventListener("click", () => {
        modal1.classList.remove("modalTrue");
        modal1.setAttribute("aria-hidden", "true")

        modal2.classList.add("modalTrue");
        modal2.setAttribute("aria-hidden", "false")
    })

    //Revient sur la page précédente
    backModaleBtn.addEventListener("click", () => {
        modal2.classList.remove("modalTrue");
        modal2.setAttribute("aria-hidden", "true")
        
        modal1.classList.add("modalTrue");
        modal1.setAttribute("aria-hidden", "false")
    })


}

//Fonction de gestion des outils admin sur la main page
function admin() {
    let bandeauAdmin = document.getElementById("bandeauAdmin");
    let modifBtn = document.getElementById("modifBtn");

    loginBtn.classList.add("logStatut");
    loginBtn.setAttribute("aria-hidden", "true")
    logoutBtn.classList.remove("logStatut");
    logoutBtn.setAttribute("aria-hidden", "false")

    //Assure qu'aucun élément n'est chargé
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

    //Affiche la modal au click et lance la fonction de la modification de la galerie
    modifBtn.addEventListener("click", () => {
        modal1.classList.add("modalTrue");
        modal1.setAttribute("aria-hidden", "false")
        galleryUpdate();
    });
};

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

// Récupération de la liste sur l'API
async function initFilterProjects () {
try {
        const allProjects = await fetch("http://localhost:5678/api/works/");
        const showAllProjects = await allProjects.json();
        
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
        };
        
        //Ajouter un événement au click sur le bouton "Tous"
        spanBtnSelect[0].addEventListener("click", () => {
            createHTML(showAllProjects);
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