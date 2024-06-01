import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Membres } from '../../model/membres';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-membre-components',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  host: { ngSkipHydration: 'true' },
  templateUrl: './membre-components.component.html',
  styleUrl: './membre-components.component.css'
})
export class MembreComponentsComponent implements OnInit {

  ngOnInit(): void {
  }

  title: string = "Liste de tous les membres";
  search: string = "";
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

  id_membre = "";
  listeMembre: Membres[] = [];
  dataSearch: Membres[] = [];

  constructor(private http: HttpClient) {
    this.getAllMembres();
  }


  effaceChamps() {
    this.membres;
  }
  getAllMembres(): void {
    this.http.get('http://localhost:8080/listeMembre').subscribe((data: any) => {
      this.listeMembre = data;
    });
  }

  setUpdate(index: number): void {
    this.membres = { ...this.listeMembre[index] };
    this.id_membre = this.membres.id_membre;
  }

  update(data = this.membres): void {
    if (this.membres.nom === "" || this.membres.prenom === "" ||
      this.membres.date_naissance === "" || this.membres.adresse === "" || this.membres.email === "" ||
      this.membres.telephone === ""
    ) {
      Swal.fire({
        icon: "warning",
        title: "MODIFICATION",
        text: "Modification Impossible, Veuillez remplir tous l'information"
      });
    } else {
      Swal.fire({
        icon: "warning",
        text: "Etes-vous sur de vouloir Modifier l'information de ce membres?",
        title: "MODIFICATION",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, Modifier!",
        cancelButtonText: "Annuler"
      }).then((result) => {
        if (result.isConfirmed) {
          this.http.put('http://localhost:8080/update_membres/' + this.id_membre, data).subscribe(
            (respose) => {
              Swal.fire({
                icon: "success",
                title: "MODIFICATION",
                text: "Modification avec success!"
              });
              this.effaceChamps();
              this.getAllMembres();
            }, (erreur) => {
              Swal.fire({
                icon: "error",
                title: "MODIFICATION",
                text: "Serveur interrompu!"
              });
            }
          );
        }
      });
    }
  }

  delete(index: number): void {
    this.membres = { ...this.listeMembre[index] };
    this.id_membre = this.membres.id_membre;
    Swal.fire({
      icon: "warning",
      text: "Etes-vous sur de vouloir supprimeer ce membre?",
      title: "SUPPRESSION",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer!",
      cancelButtonText: "Annuler"
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete('http://localhost:8080/deleteMembre/' + this.id_membre).subscribe(() => {
          this.getAllMembres();
        })
      }
    });
  }

  searchMembre(): void {
    if (this.search === "") {
      Swal.fire({
        icon: "warning",
        text: "Recherche impossible, Veuillez saisir un prenom",
        title: "RECHERCHE"
      });
    } else {
      this.http.get("http://localhost:8080/searchByPrenom/" + this.search).subscribe(
        (data: any) => {
          this.dataSearch = data;
        }
      );
    }
  }

}
