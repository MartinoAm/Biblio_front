import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Membres } from '../../model/membres';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ajout-membre',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './ajout-membre.component.html',
  styleUrl: './ajout-membre.component.css'
})
export class AjoutMembreComponent implements OnInit {

  ngOnInit(): void {
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

  constructor(private http: HttpClient) { }

  effaceChamps(): void {
    this.membres = {
      id_membre: '',
      nom: '',
      prenom: '',
      date_naissance: '',
      email: '',
      telephone: '',
      adresse: '',
      sexe: ''
    }
  }
  savenewmembers(data = this.membres): void {
    if (this.membres.nom === "" || this.membres.date_naissance === "" || this.membres.email === "" || this.membres.telephone === "" || this.membres.sexe === "") {
      Swal.fire({
        icon: "warning",
        title: "AJOUT NOUVEAU MEMBRE",
        text: "Erreur de l'enregistrement de nouveau membres, Veuillez verifier tous les champs!"
      });
    } else {
      this.http.post('http://localhost:8080/addMembre', data).subscribe(
        (response) => {
          Swal.fire({
            icon: "success",
            title: "AJOUT NOUVEAU MEMBRE",
            text: "Nouveau memebre enregistrer avec success!"
          });
          this.effaceChamps();
        }, (erreur) => {
          Swal.fire({
            icon: "warning",
            title: "AJOUT NOUVEAU MEMBRE",
            text: "Erreur de la serveur"
          });
        }
      );
    }
  }
}
