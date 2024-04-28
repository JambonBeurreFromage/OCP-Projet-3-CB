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

        //Créer les boutons de supression des travaux
        trashBtn = document.createElement("span");
        trashBtn.classList.add("trashBtn")
        trashBtn.innerHTML = "<span class=\"fa-solid fa-trash-can\"></span>"
        trashBtn.setAttribute("tabindex", "3") // Permet de rendre l'élément selectionnable avec tab
        figure.appendChild(trashBtn);

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
        
        //Créer les mignatures
        let img = document.createElement("img");
        img.src = showAllProjects[i].imageUrl;
        figure.appendChild(img);
    };

    //Formulaire d'ajout d'images
    document.addEventListener("DOMContentLoaded", function() {
        const uploadForm = document.getElementById("uploadForm");
        const imageUpload = document.getElementById("imageUpload");
        const imagePreviewContainer = document.getElementById("imagePreviewContainer");
        const imagePreview = document.getElementById("imagePreview");
    
        // Événement de changement de l'input de téléchargement d'image
        imageUpload.addEventListener("change", function() {
            const file = this.files[0]; // Récupérer le fichier image sélectionné
            if (file) {
                const reader = new FileReader(); // Créer un objet FileReader
    
                // Événement chargement de l'image
                reader.onload = function() {
                    imagePreview.src = reader.result; // Afficher l'image chargée dans l'aperçu
                    imagePreviewContainer.style.display = "block"; // Afficher l'aperçu de l'image
                }
    
                reader.readAsDataURL(file); // Charger l'image en tant que données URL
            }
        });
    
        // Gestionnaire de soumission du formulaire
        uploadForm.addEventListener("submit", async function(event) {
            event.preventDefault();
    
            // Récupérer les données du formulaire
            const formData = new FormData(uploadForm);
    
            try {
                const response = await fetch("http://localhost:5678/api/upload", {
                    method: "POST",
                    body: formData,
                    headers: {
                        // Ajoutez les en-têtes nécessaires, comme le token d'authentification si nécessaire
                    }
                });
    
                if (response.ok) {
                    // Gérer la réussite de l'envoi de l'image
                    console.log("Image envoyée avec succès !");
                    // Réinitialiser le formulaire après l'envoi réussi
                    uploadForm.reset();
                    // Masquer l'aperçu de l'image après l'envoi réussi
                    imagePreviewContainer.style.display = "none";
                } else {
                    // Gérer les erreurs lors de l'envoi de l'image
                    console.error("Erreur lors de l'envoi de l'image :", response.status);
                }
            } catch (error) {
                console.error("Erreur lors de la requête :", error);
            }
        });
    });

    //Gestion de la fermeture de la fenêtre modale et/ou changement de page

    //fermeture de la modale avec la croix
    closeModaleBtn.forEach(btn => {
        btn.addEventListener("click", () => {
            modal1.classList.remove("modalTrue");
            modal1.setAttribute("aria-hidden", "true")

            modal2.classList.remove("modalTrue");
            modal2.setAttribute("aria-hidden", "true")
        });

        btn.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                modal1.classList.remove("modalTrue");
                modal1.setAttribute("aria-hidden", "true")

                modal2.classList.remove("modalTrue");
                modal2.setAttribute("aria-hidden", "true")
            }
        });
    });

     //fermeture de la fenêtre lors de l'appui sur Esc
     window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            modal1.classList.remove("modalTrue");
            modal1.setAttribute("aria-hidden", "true")

            modal2.classList.remove("modalTrue");
            modal2.setAttribute("aria-hidden", "true")
        }
     });

    //Changement de page
    addProjectBtn.addEventListener("click", () => {
        modal1.classList.remove("modalTrue");
        modal1.setAttribute("aria-hidden", "true")

        modal2.classList.add("modalTrue");
        modal2.setAttribute("aria-hidden", "false")
    });

    addProjectBtn.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            modal1.classList.remove("modalTrue");
            modal1.setAttribute("aria-hidden", "true")
    
            modal2.classList.add("modalTrue");
            modal2.setAttribute("aria-hidden", "false")
        }
    });

    //Revient sur la page précédente
    backModaleBtn.addEventListener("click", () => {
        modal2.classList.remove("modalTrue");
        modal2.setAttribute("aria-hidden", "true")
        
        modal1.classList.add("modalTrue");
        modal1.setAttribute("aria-hidden", "false")
    });

    backModaleBtn.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            modal2.classList.remove("modalTrue");
            modal2.setAttribute("aria-hidden", "true")
            
            modal1.classList.add("modalTrue");
            modal1.setAttribute("aria-hidden", "false")
        }
    });


};