import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Empruntes } from '../../model/emprunte';
import { Livres } from '../../model/livres';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  host: { ngSkipHydration: 'true' },
  templateUrl: './historique.component.html',
  styleUrl: './historique.component.css',
  providers: [DatePipe]
})
export class HistoriqueComponent implements OnInit {



  ngOnInit(): void {
    this.historique;

    for (let i = 0; i < this.historique.length; i++) {
      const element = this.historique[i].retour;
      this.dateRetourLivres.push(element);
    }
    this.checkReturnDates();
  }

  title: string = "Livre emprunter encours";

  historique: Empruntes[] = [];
  dateRetourLivres: any[] = [];
  dateNow: Date = new Date();

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
  nombreExempalireReturn = "";
  id_livre = "";
  id_emprunte = "";
  disponibitity: boolean = true;

  emprunterRetour: Empruntes = {
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

  constructor(private http: HttpClient, private datePipe: DatePipe) {
    this.historiqueListe();
  }
  //debut date compare
  checkReturnDates() {
    this.dateRetourLivres.forEach(dates => {
      this.compareDates(new Date(dates));
    });
  }

  compareDates(dates: Date) {
    const dateNow = new Date(this.dateNow);
    if (dates.getTime() === dateNow.getTime()) {
      const datechange = this.datePipe.transform(dates, "YYY-MM-dd");
      let dataLivres: any = [];
      let dataMembres: any = [];
      for (let i = 0; i < this.historique.length; i++) {
        if (datechange === this.historique[i].retour) {
          dataLivres = this.historique[i].livres;
          dataMembres = this.historique[i].membres;
        } Swal.fire({
          icon: "info",
          text: "Il est temps de remetre le livre " + dataLivres.titre + " emprunter par " + dataMembres.nom + " " + dataMembres.prenom + " le " + datechange,
          title: "EMPRUNTER"
        });
      }
    }
    if (dates.getTime() < dateNow.getTime()) {
      const datechange = this.datePipe.transform(dates, "YYY-MM-dd");
      let dataLivres: any = [];
      let dataMembres: any = [];
      for (let i = 0; i < this.historique.length; i++) {
        if (datechange === this.historique[i].retour) {
          dataLivres = this.historique[i].livres;
          dataMembres = this.historique[i].membres;
        }
      }
      Swal.fire({
        icon: "info",
        text: "Il est temps de remetre le livre " + dataLivres.titre + " emprunter par " + dataMembres.nom + " " + dataMembres.prenom + " le " + datechange,
        title: "EMPRUNTER"
      });
    }
  }

  //fin

  historiqueListe(): void {
    this.http.get('http://localhost:8080/historique').subscribe(
      (data: any) => {
        this.historique = data;
      }
    );
  }

  setDataBookReturn(index: number): void {
    this.emprunterRetour = { ...this.historique[index] }
    this.id_livre = this.emprunterRetour.livres.id_livre;
    this.nombreExempalireReturn = this.emprunterRetour.livres.exemplaire;
    let result = parseInt(this.nombreExempalireReturn);
    result += 1;
    this.emprunterRetour.livres.exemplaire = result.toString();

    this.livres = this.emprunterRetour.livres;
    this.id_emprunte = this.emprunterRetour.id;
    this.livres.disponible = this.disponibitity;

    if (this.id_livre === "") {
      console.log("Impossible de retourner le livre");

    } else {
      this.http.put("http://localhost:8080/update/" + this.id_livre, this.livres).subscribe(
        (result) => {
          console.log("OK disponibilite change");
          if (this.id_emprunte === "") {
            console.log("Impossible de retourner des livres");

          } else {
            this.http.delete("http://localhost:8080/deleteEmprunte/" + this.id_emprunte).subscribe(
              (response) => {
                Swal.fire({
                  icon: "success",
                  title: "EMPRUNTER",
                  text: "Livre bien etre retourner avec success!"
                });
                this.historiqueListe();
              },
              (erreur) => {
                Swal.fire({
                  icon: "error",
                  title: "EMPRUNTER",
                  text: "Erreur de serveur ne repond pas"
                });
              }
            );
          }
        }, (erreur) => {
          Swal.fire({
            icon: "error",
            title: "EMPRUNTER",
            text: "Erreur de serveur ne repond pas"
          });
        });
    }
  }
}
