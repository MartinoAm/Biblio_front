import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Livres } from '../../model/livres';
import { Membres } from '../../model/membres';
import { Empruntes } from '../../model/emprunte';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-emprunte',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './emprunte.component.html',
  styleUrl: './emprunte.component.css'
})
export class EmprunteComponent implements OnInit {

  ngOnInit(): void {
  }

  title: string = "Emprunter des Livres";

  id_membre_emprunte = "";
  idLivre_emprunte = "";
  nombreExemplaire: number = 0;
  disponibility = false;
  dataUpdate: any;
  search: string = "";

  livres: Livres = {
    id_livre: "",
    titre: "",
    type: "",
    auteur: "",
    description: "",
    exemplaire: "",
    date_edition: "",
    disponible: true,
  }
  membres: Membres = {
    id_membre: '',
    nom: '',
    prenom: '',
    date_naissance: '',
    email: '',
    telephone: '',
    adresse: '',
    sexe: ''
  }
  emprunte: Empruntes = {
    id: '',
    membres: {
      id_membre: '',
      nom: '',
      prenom: '',
      date_naissance: '',
      email: '',
      telephone: '',
      adresse: '',
      sexe: ''
    },
    livres: {
      id_livre: "",
      titre: "",
      type: "",
      auteur: "",
      description: "",
      exemplaire: "",
      date_edition: "",
      disponible: true,
    },
    debut: '',
    retour: ''
  }

  livresAll: Livres[] = [];
  membresAll: Membres[] = [];
  historiques: Empruntes[] = [];


  constructor(private http: HttpClient, private router: Router) {
    this.AllBook();
    this.AllMembers();
    this.emprunteHistorique();
  }

  AllBook(): void {
    this.http.get('http://localhost:8080/listLivre').subscribe((data: any) => {
      this.livresAll = data;
    });
  }

  AllMembers(): void {
    this.http.get('http://localhost:8080/listeMembre').subscribe((data: any) => {
      this.membresAll = data;
    })
  }

  effaceDonneeSave(): void {
    this.emprunte = {
      id: '',
      membres: {
        id_membre: '',
        nom: '',
        prenom: '',
        date_naissance: '',
        email: '',
        telephone: '',
        adresse: '',
        sexe: ''
      },
      livres: {
        id_livre: "",
        titre: "",
        type: "",
        auteur: "",
        description: "",
        exemplaire: "",
        date_edition: "",
        disponible: true,
      },
      debut: '',
      retour: ''
    }
  }
  setUpdate(index: number): void {
    this.livres = { ...this.livresAll[index] }
    this.emprunte.livres.id_livre = this.livres.id_livre;
    this.idLivre_emprunte = this.emprunte.livres.id_livre;

    this.livreEmpruntebyId();
  }

  emprunteLivre(): void {
    //Verification nombre d'exemplaire
    if (this.livres.exemplaire.toString() === "0") {
      Swal.fire({
        icon: "warning",
        title: "EMPRUNTE",
        text: "Ce livres est indisponible"
      });
    } else {
      //verification deonnee membres
      if (this.id_membre_emprunte === "") {
        Swal.fire({
          icon: "warning",
          title: "ERROR MEMBRES INFO",
          text: "Information de d'adherant non prise en charge!"
        });
      } else {
        //verification donnee stocker
        if (this.emprunte.debut === "" || this.emprunte.retour === "" || this.emprunte.membres == null || this.emprunte.livres == null) {
          Swal.fire({
            icon: "warning",
            title: "EMPRUNTER LIVRE",
            text: "DOnnee mambres pas trouver"
          });

        } else {
          let id_existe = 0;
          for (let i = 0; i < this.historiques.length; i++) {
            if (this.id_membre_emprunte == this.historiques[i].membres.id_membre) {
              id_existe += 1;
            }
          }
          if (id_existe == 1) {
            Swal.fire({
              icon: "warning",
              title: "EMPRUNTER LIVRE",
              text: "Ce membres ne peut pas avoir un livre, car il/elle est deja prendre un livre"
            });
          } else {
            this.nombreExemplaire -= 1;
            this.livres.exemplaire = this.nombreExemplaire.toString();
            this.emprunte.membres.id_membre = this.id_membre_emprunte;

            this.http.post("http://localhost:8080/register", this.emprunte).subscribe(
              (response) => {
                this.http.post('http://localhost:8080/historiqueSave', this.emprunte).subscribe(
                  () => {
                    Swal.fire({
                      icon: "success",
                      title: "EMPRUNTE",
                      text: "Livres bien etre emprunter"
                    });
                  }
                );

                if (this.livres.exemplaire.toString() === "0") {
                  this.livres.disponible = this.disponibility;
                  this.http.put("http://localhost:8080/update/" + this.idLivre_emprunte, this.livres).subscribe(
                    (result) => {
                      this.AllBook();
                    }, (erreur) => {
                      console.log("Erreur de maj de disponibilite de livre");
                    }
                  );
                } else {
                  this.http.put("http://localhost:8080/update/" + this.idLivre_emprunte, this.livres).subscribe(
                    (result) => {
                      this.AllBook();
                    }, (erreur) => {
                      console.log("Erreur de maj de livres");
                    }
                  );
                }
                this.effaceDonneeSave();
                this.emprunteHistorique();
              }, (erreur) => {
                Swal.fire({
                  icon: "error",
                  title: "EMPRUNTE",
                  text: "Erreur de l'emprunte, Serveur ne repond pas!"
                });
              }
            );
          }


        }
      }
    }
  }



  livreEmpruntebyId(): void {
    this.http.get('http://localhost:8080/livre/' + this.idLivre_emprunte).subscribe((data: any) => {
      this.emprunte.livres = data;
      this.nombreExemplaire = data.exemplaire;
    });
  }

  emprunteHistorique(): void {
    this.http.get('http://localhost:8080/historique').subscribe(
      (data: any) => {
        this.historiques = data;
      }
    );
  }
  x: Livres[] = [];
  searchLivreEmprunter(): void {
    if (this.search === "") {
      Swal.fire({
        icon: "warning",
        text: "Veuilleir saisir un titre de livre",
        title: "RECHERCHE"
      });
    } else {
      this.http.get("http://localhost:8080/searchLivre/" + this.search).subscribe((data: any) => {
        this.x = data;
      });
    }
  }
}
