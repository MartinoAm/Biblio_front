import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Livres } from '../../model/livres';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-livres',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './livres.component.html',
  styleUrl: './livres.component.css'
})
export class LivresComponent implements OnInit {

  ngOnInit(): void {
  }

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
  id_livre = "";
  livresPack: Livres[] = [];
  constructor(private http: HttpClient) {
    this.getPackLivres();
  }

  champsEfface(): void {
    this.livres = {
      id_livre: "",
      titre: "",
      type: "",
      auteur: "",
      description: "",
      exemplaire: "",
      date_edition: "",
      disponible: true,
    }
  }

  addnewbook(data = this.livres): void {
    if (this.livres.titre === "" || this.livres.auteur === "" || this.livres.type === "" || this.livres.description === "" || this.livres.exemplaire === "" || this.livres.date_edition === "") {
      Swal.fire({
        icon: "warning",
        title: "AJOUTER NOUVELLE LIVRE",
        text: "Erreur de la sauvegarde de livre, Verifier tout les champs disponible"
      });
    } else {
      this.http.post('http://localhost:8080/addLivre', data).subscribe(
        (response) => {
          Swal.fire({
            icon: "success",
            title: "AJOUTER NOUVELLE LIVRE",
            text: "Nouvelle livre sauvegarder avec success"
          });
          this.champsEfface();
          this.getPackLivres();
        }, (erreur) => {
          Swal.fire({
            icon: "warning",
            title: "AJOUTER NOUVELLE LIVRE",
            text: "Erreur lors de serveur"
          });
        }
      );
    }
  }

  getPackLivres(): void {
    this.http.get('http://localhost:8080/listLivre').subscribe(
      (data: any) => {
        this.livresPack = data;
      }
    )
  }

  dataUpdate(index: number): void {
    this.livres = { ...this.livresPack[index] };
    this.id_livre = this.livres.id_livre;
  }

  update(): void {
    if (this.id_livre === "") {
      Swal.fire({
        icon: "warning",
        title: "MODIFICATION",
        text: "Modification Impossible, Donnee de livres pas recuperer"
      });
    } else {
      Swal.fire({
        icon: "warning",
        text: "Etes-vous sur de vouloir Modifier ce livre?",
        title: "MODIFICATION",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, Modifier!",
        cancelButtonText: "Annuler"
      }).then((result) => {
        if (result.isConfirmed) {
          this.http.put("http://localhost:8080/update/" + this.id_livre, this.livres).subscribe(
            (response) => {
              Swal.fire({
                icon: "success",
                title: "MODIFICATION",
                text: "Modification Reussi!"
              });
              this.getPackLivres();
            }, (erreur) => {
              Swal.fire({
                icon: "error",
                title: "MODIFICATION",
                text: "Serveur ne repond pas"
              });
            }
          );
        }
      });
    }
  }
}
