import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Users } from '../../model/users';
import Swal from 'sweetalert2';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  host: { ngSkipHydration: 'true' },
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

  ngOnInit(): void {

  }

  user: Users = {
    id: "",
    pseudo: "",
    email: "",
    password: "",
    type: ""
  }

  password_confirme: string = "";

  data = this.user;

  constructor(private http: HttpClient, private router: Router) { }


  erreur: string = "";
  effaceChamps(): void {
    this.user = {
      id: "",
      pseudo: "",
      email: "",
      password: "",
      type: ""
    }

    this.password_confirme = ""
  }

  newUsers(): void {
    if (this.user.pseudo === "" || this.user.email === "" || this.user.password === "" || this.user.type === "") {
      Swal.fire({
        icon: 'warning',
        title: "ERROR REGISTER",
        text: "Erreur de l'enregistrement"
      })
    } else if (this.user.password !== this.password_confirme) {
      this.erreur = "Mot de passe erreur";
      this.password_confirme = "";
    } else {
      this.http.post('http://localhost:8080/addUser', this.data).subscribe(
        (response) => {
          Swal.fire({
            icon: "success",
            title: "SUCCESS REGISTER",
            text: "Ajout nouveau compte reussi!"
          });
          this.effaceChamps();
          this.router.navigateByUrl('/login');
        }, (erreur) => {
          Swal.fire({
            icon: "error",
            title: "ERROR REGISTER",
            text: "Erreur lors de la connexion au serveur"
          })
        }
      );
    }
  }
}
