import { Component, Inject, OnInit, PLATFORM_ID, Renderer2, RendererFactory2, ViewChild } from '@angular/core';
import { Livres } from '../../model/livres';
import { Membres } from '../../model/membres';
import { Historique } from '../../model/historique';
import { Empruntes } from '../../model/emprunte';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule,],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  livres: Livres[] = [];
  membres: Membres[] = [];
  history: Historique[] = [];
  emprunte: Empruntes[] = [];

  NombreLivreEmprunte: number = 0;
  membresTOTAL: number = 0;
  livresItems: number = 0;
  membreMale = 0;
  membreFemelle = 0;

  totalRecuRetourner = 0;

  labelss: any[] = [];
  dataLivress: any[] = [];
  labes: any[] = [];
  dataLabes: [] = [];
  lineRep: any;
  color: any = ["#00CED1", "#CE2029", "#87421F", "#0048BA", "#B0BF1A", "#DB2D43", "#9F2B68", "3DDC84", "#665D1E", "#4B6F44", "#FDEE00", "#7C0A02", "#7BB661", "#3D2B1F", "#CC5500", "#FFEF00"]

  ngOnInit(): void {
    //livre retourner
    this.totalRecuRetourner = this.totalHistorique.length - this.history.length;

    this.NombreLivreEmprunte = this.history.length;
    this.membresTOTAL = this.membres.length;
    this.livresItems = this.livres.length;
    let dataM: any[] = [];
    let dataL: any[] = [];

    for (let i = 0; i < this.membres.length; i++) {
      if (this.membres[i].sexe === "male") {
        dataM.push(i);
      } else {
        dataL.push(i)
      }
    }

    this.membreFemelle = dataL.length;
    this.membreMale = dataM.length;

    // REpartion membres
    for (let i = 0; i < this.membres.length; i++) {
      const element = this.membres[i].sexe;
      this.labes.push(element);
    }

    const lineCanvasEle: any = document.getElementById('line_chart')
    const lineChar = new Chart(lineCanvasEle.getContext('2d'), {
      type: 'pie',
      data: {
        labels: ["Male", "Femele"],
        datasets: [
          {
            data: [this.membreMale, this.membreFemelle],
            label: 'Nombres ',
            borderColor: this.color,
            backgroundColor: this.color,
          },

        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Count Livre par category
    for (let i = 0; i < this.livres.length; i++) {
      const element = this.livres[i].type;
      this.categories.push(element)
      this.categoryCounts = this.countOccurrences(this.categories);
      this.uniqueCategorie = this.getUniqueCategories(this.categories);
    }
    const barCanvasEle: any = document.getElementById('bar_chart')
    const barChart = new Chart(barCanvasEle.getContext('2d'), {
      type: 'bar',
      data: {
        labels: this.uniqueCategorie,
        datasets: [{
          label: 'Total ',
          data: this.categoryCounts,
          backgroundColor: this.color,
          borderColor: this.color,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Repartinon livres ========================================================================

    for (let i = 0; i < this.livres.length; i++) {
      const element = this.livres[i].titre;
      this.labelss.push(element)
    }
    for (let i = 0; i < this.livres.length; i++) {
      const element = this.livres[i].exemplaire;
      this.dataLivress.push(element)
    }
    const line_repart: any = document.getElementById('livres_repart')
    this.lineRep = new Chart(line_repart.getContext('2d'), {
      type: 'bar',
      data: {
        labels: this.labelss,
        datasets: [
          {
            data: this.dataLivress,
            label: 'Livres',
            borderColor: this.color,
            backgroundColor: this.color,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    //=======Repartion EMprunter
    const emprunteCanvas: any = document.getElementById('emprunter_chart')
    const enpre = new Chart(emprunteCanvas.getContext('2d'), {
      type: 'pie',
      data: {
        labels: ["Livres retourné", "livre en cour d'emprunte"],
        datasets: [
          {
            data: [this.totalRecuRetourner, this.history.length],
            label: 'nombres ',
            borderColor: this.color,
            backgroundColor: this.color,
          },

        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    //LIVRE LE PLUS EMPRUNTER
    for (let i = 0; i < this.totalHistorique.length; i++) {
      const element = this.totalHistorique[i].livres.type;
      this.type.push(element);
      this.typeCounts = this.TypeOccurrences(this.type);
      this.uniqueTYpe = this.getUniqueTtype(this.type);
    }
    const livrePlus: any = document.getElementById('repart_plus_chart')
    const emprunPlus = new Chart(livrePlus.getContext('2d'), {
      type: 'bar',
      data: {
        labels: this.uniqueTYpe,
        datasets: [{
          label: 'Total ',
          data: this.typeCounts,
          backgroundColor: this.color,
          borderColor: this.color,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  //Recuper donneer duplicate
  categories: string[] = [];
  uniqueCategorie: string[] = [];
  categoryCounts: { [key: string]: number } = {};
  countOccurrences(categories: string[]): { [key: string]: number } {
    return categories.reduce((acc: { [key: string]: number }, category: string) => {
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
  }
  getUniqueCategories(categories: string[]): string[] {
    return Array.from(new Set(categories));
  }

  //type Livres emprunter
  type: string[] = [];
  uniqueTYpe: string[] = [];
  typeCounts: { [key: string]: number } = {};
  TypeOccurrences(type: string[]): { [key: string]: number } {
    return type.reduce((acc: { [key: string]: number }, category: string) => {
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
  }
  getUniqueTtype(type: string[]): string[] {
    return Array.from(new Set(type));
  }



  constructor(private http: HttpClient) {
    this.empunterSomme();
    this.getAllMembres();
    this.getPackLivres();
    this.historiquesEmprunte();
  }
  empunterSomme(): void {
    this.http.get('http://localhost:8080/historique').subscribe(
      (data: any) => {
        this.history = data;
      }
    );
  }

  totalHistorique: any[] = [];
  historiquesEmprunte(): void {
    this.http.get("http://localhost:8080/historiqueListe").subscribe((data: any) => {
      this.totalHistorique = data;
    });

    console.log(this.totalHistorique);

  }

  getAllMembres(): void {
    this.http.get('http://localhost:8080/listeMembre').subscribe((data: any) => {
      this.membres = data;
    });


  }
  getPackLivres(): void {
    this.http.get('http://localhost:8080/listLivre').subscribe(
      (data: any) => {
        this.livres = data;
      }
    );
  }
}
